"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Sprout,
  Plus,
  Trash2,
  CalendarDays,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  IndianRupee,
  Pencil,
  Save,
  TrendingUp,
  Archive,
  ArchiveRestore,
  FileSpreadsheet,
  FileDown,
} from "lucide-react";

import { farmerApi } from "@/lib/farmerApi";
import {
  fetchAgmarknetFilters,
  formatMandiDateDisplay,
  formatMandiPrice,
  getAgmarknetLocationIds,
  getAgmarknetRates,
  getLocalDate,
} from "@/services/mandiApi";

const CROP_RATE_ALIASES = {
  soybean: ["soybean", "soyabean", "soya", "सोयाबीन"],
  garlic: ["garlic", "लहसुन"],
  wheat: ["wheat", "गेहूं", "गेहूँ"],
  gram: ["gram", "chana", "bengal gram", "चना"],
  mustard: ["mustard", "सरसों"],
  maize: ["maize", "corn", "मक्का"],
  rice: ["rice", "paddy", "धान", "चावल"],
  onion: ["onion", "प्याज"],
  cotton: ["cotton", "कपास"],
  potato: ["potato", "आलू"],
  tomato: ["tomato", "टमाटर"],
};

const EXPENSE_STAGES = ["भूमि तैयारी", "बुवाई", "फसल वृद्धि", "कटाई", "बिक्री"];

function getCropFinancials(crop) {
  const totalExpenses = (crop.expenses || []).reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );
  const area = Number(crop.area || 0);
  const production = Number(crop.estimatedProductionQuintals || 0);
  const salePrice = Number(crop.expectedSalePrice || 0);
  const expectedIncome = production * salePrice;

  return {
    totalExpenses,
    costPerAcre: area > 0 ? totalExpenses / area : 0,
    expectedIncome,
    expectedProfit: expectedIncome - totalExpenses,
  };
}

function normalizeCropName(value) {
  return String(value || "")
    .toLocaleLowerCase("hi")
    .replace(/[^a-z0-9\u0900-\u097f]/g, "");
}

function cropNamesMatch(cropName, marketName) {
  const crop = normalizeCropName(cropName);
  const market = normalizeCropName(marketName);
  if (!crop || !market) return false;
  if (crop === market) return true;

  const aliases = Object.values(CROP_RATE_ALIASES).find((values) =>
    values.some((value) => normalizeCropName(value) === crop)
  ) || [crop];

  return aliases.some((alias) => {
    const normalizedAlias = normalizeCropName(alias);
    return normalizedAlias.length > 3 && market.includes(normalizedAlias);
  });
}

export default function MyCropsPage() {
  const [crops, setCrops] = useState([]);
  const [cropPrices, setCropPrices] = useState([]);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expenseCropId, setExpenseCropId] = useState("");
  const [editingExpenseId, setEditingExpenseId] = useState("");
  const [savingExpense, setSavingExpense] = useState(false);
  const [cropView, setCropView] = useState("active");
  const [editingEstimateId, setEditingEstimateId] = useState("");
  const [savingEstimate, setSavingEstimate] = useState(false);
  const [estimateForm, setEstimateForm] = useState({ production: "", salePrice: "" });
  const [expenseForm, setExpenseForm] = useState({
    category: "बीज",
    stage: "बुवाई",
    amount: "",
    date: getLocalDate(),
    note: "",
  });

  const [form, setForm] = useState({
    name: "",
    area: "",
    season: "खरीफ",
    status: "बुवाई की तैयारी",
    sowingDate: "",
    estimatedProductionQuintals: "",
    expectedSalePrice: "",
  });

  const loadCrops = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await farmerApi.getCrops();
      if (Array.isArray(res.data)) {
        setCrops(res.data);
      } else {
        setCrops([]);
      }
    } catch (err) {
      console.error("Load crops error:", err);
      setError("फसलें लोड नहीं हो सकीं।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCrops();
  }, [loadCrops]);

  const cropNamesKey = useMemo(
    () => crops.map((crop) => crop.name).filter(Boolean).join("|").toLocaleLowerCase("hi"),
    [crops]
  );

  const totalExpenses = useMemo(
    () =>
      crops.reduce(
        (total, crop) =>
          total + (crop.expenses || []).reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
        0
      ),
    [crops]
  );

  const totalExpectedIncome = useMemo(
    () => crops.reduce((total, crop) => total + getCropFinancials(crop).expectedIncome, 0),
    [crops]
  );
  const totalExpectedProfit = totalExpectedIncome - totalExpenses;
  const activeCrops = useMemo(() => crops.filter((crop) => !crop.isArchived), [crops]);
  const archivedCrops = useMemo(
    () =>
      crops
        .filter((crop) => crop.isArchived)
        .sort((left, right) => new Date(right.archivedAt || right.updatedAt || 0) - new Date(left.archivedAt || left.updatedAt || 0)),
    [crops]
  );
  const visibleCrops = cropView === "history" ? archivedCrops : activeCrops;

  useEffect(() => {
    if (!cropNamesKey) {
      setCropPrices([]);
      return undefined;
    }

    let cancelled = false;
    async function loadPrices() {
      try {
        setLoadingPrices(true);
        setPriceError("");
        const [profileResult, filterSource] = await Promise.all([
          farmerApi.getProfile(),
          fetchAgmarknetFilters(),
        ]);
        const profile = profileResult.data?.user || {};
        const location = await getAgmarknetLocationIds(
          profile.state,
          profile.district,
          filterSource
        );
        const result = await getAgmarknetRates({
          date: getLocalDate(),
          state: location.stateId,
          district: location.districtId,
          market: "",
          commodity: "",
          limit: 250,
        });
        if (!cancelled) setCropPrices(result.data || []);
      } catch (err) {
        if (!cancelled) {
          setCropPrices([]);
          setPriceError(err.message || "मंडी भाव लोड नहीं हो सके।");
        }
      } finally {
        if (!cancelled) setLoadingPrices(false);
      }
    }

    loadPrices();
    return () => {
      cancelled = true;
    };
  }, [cropNamesKey]);

  function updateCropExpenses(cropId, expenses) {
    setCrops((previous) =>
      previous.map((crop) =>
        String(crop._id || crop.id) === String(cropId)
          ? { ...crop, expenses }
          : crop
      )
    );
  }

  function openExpenseForm(cropId, expense = null) {
    setExpenseCropId(String(cropId));
    setEditingExpenseId(expense ? String(expense._id || expense.id) : "");
    setExpenseForm({
      category: expense?.category || "बीज",
      stage: expense?.stage || "बुवाई",
      amount: expense?.amount ?? "",
      date: expense?.date ? new Date(expense.date).toISOString().slice(0, 10) : getLocalDate(),
      note: expense?.note || "",
    });
    setError("");
  }

  async function handleExpenseSubmit(event, cropId) {
    event.preventDefault();
    if (!Number.isFinite(Number(expenseForm.amount)) || Number(expenseForm.amount) <= 0) {
      setError("खर्च की राशि शून्य से अधिक दर्ज करें।");
      return;
    }

    try {
      setSavingExpense(true);
      setError("");
      const payload = {
        category: expenseForm.category,
        stage: expenseForm.stage,
        amount: Number(expenseForm.amount),
        date: expenseForm.date,
        note: expenseForm.note.trim(),
      };
      const result = editingExpenseId
        ? await farmerApi.updateCropExpense(cropId, editingExpenseId, payload)
        : await farmerApi.addCropExpense(cropId, payload);
      updateCropExpenses(cropId, result.data?.expenses || []);
      setExpenseCropId("");
      setEditingExpenseId("");
      setSuccess(editingExpenseId ? "खर्च अपडेट हो गया।" : "खर्च सुरक्षित हो गया।");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "खर्च सुरक्षित नहीं हो सका।");
    } finally {
      setSavingExpense(false);
    }
  }

  async function handleDeleteExpense(cropId, expenseId) {
    if (!window.confirm("क्या आप यह खर्च हटाना चाहते हैं?")) return;
    try {
      setError("");
      const result = await farmerApi.deleteCropExpense(cropId, expenseId);
      updateCropExpenses(cropId, result.data?.expenses || []);
    } catch (err) {
      setError(err.message || "खर्च हटाया नहीं जा सका।");
    }
  }

  function openEstimateForm(crop) {
    setEditingEstimateId(String(crop._id || crop.id));
    setEstimateForm({
      production: crop.estimatedProductionQuintals ?? "",
      salePrice: crop.expectedSalePrice ?? "",
    });
  }

  async function handleEstimateSubmit(event, cropId) {
    event.preventDefault();
    const production = Number(estimateForm.production || 0);
    const salePrice = Number(estimateForm.salePrice || 0);
    if (!Number.isFinite(production) || production < 0 || !Number.isFinite(salePrice) || salePrice < 0) {
      setError("उत्पादन और बिक्री मूल्य शून्य या उससे अधिक रखें।");
      return;
    }

    try {
      setSavingEstimate(true);
      setError("");
      const result = await farmerApi.updateCrop(cropId, {
        estimatedProductionQuintals: production,
        expectedSalePrice: salePrice,
      });
      if (Array.isArray(result.data)) setCrops(result.data);
      else {
        setCrops((previous) => previous.map((crop) =>
          String(crop._id || crop.id) === String(cropId)
            ? { ...crop, estimatedProductionQuintals: production, expectedSalePrice: salePrice }
            : crop
        ));
      }
      setEditingEstimateId("");
      setSuccess("फसल का अनुमान अपडेट हो गया।");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "फसल का अनुमान अपडेट नहीं हो सका।");
    } finally {
      setSavingEstimate(false);
    }
  }

  async function handleArchiveCrop(crop) {
    const archived = !crop.isArchived;
    try {
      const result = await farmerApi.updateCrop(crop._id || crop.id, { isArchived: archived });
      if (Array.isArray(result.data)) setCrops(result.data);
      else setCrops((previous) => previous.map((item) =>
        String(item._id || item.id) === String(crop._id || crop.id)
          ? { ...item, isArchived: archived, archivedAt: archived ? new Date().toISOString() : null }
          : item
      ));
      setSuccess(archived ? "फसल को पिछली फसलों में रखा गया।" : "फसल सक्रिय सूची में लौटाई गई।");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "फसल रिपोर्ट अपडेट नहीं हो सकी।");
    }
  }

  function exportCsv() {
    const headers = [
      "Crop", "Season", "Status", "Area (acre)", "Expected production (quintal)",
      "Expected sale price (INR/quintal)", "Expected income (INR)", "Expenses (INR)",
      "Cost per acre (INR)", "Expected profit (INR)", "Archived",
      "Expense date", "Expense stage", "Expense category", "Expense amount (INR)", "Note",
    ];
    const rows = crops.flatMap((crop) => {
      const financials = getCropFinancials(crop);
      const expenses = crop.expenses?.length ? crop.expenses : [null];
      return expenses.map((expense) => [
        crop.name,
        crop.season,
        crop.status,
        crop.area,
        crop.estimatedProductionQuintals || 0,
        crop.expectedSalePrice || 0,
        financials.expectedIncome,
        financials.totalExpenses,
        financials.costPerAcre,
        financials.expectedProfit,
        crop.isArchived ? "Yes" : "No",
        expense?.date ? new Date(expense.date).toISOString().slice(0, 10) : "",
        expense?.stage || "",
        expense?.category || "",
        expense?.amount || "",
        expense?.note || "",
      ]);
    });
    const escapeCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `crop-finance-report-${getLocalDate()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    const reportWindow = window.open("", "_blank", "width=1000,height=750");
    if (!reportWindow) {
      setError("PDF रिपोर्ट खोलने के लिए पॉप-अप की अनुमति दें।");
      return;
    }

    const doc = reportWindow.document;
    doc.title = "फसल खर्च और मुनाफा रिपोर्ट";
    const style = doc.createElement("style");
    style.textContent = "body{font-family:Arial,sans-serif;color:#17211d;padding:24px}h1{font-size:22px}p{color:#52605a}.summary{margin:16px 0;padding:12px;background:#eef6f0}table{width:100%;border-collapse:collapse;font-size:12px}th,td{padding:8px;border:1px solid #cbd5ce;text-align:left}th{background:#e8f1ea}@media print{body{padding:0}}";
    doc.head.appendChild(style);

    const heading = doc.createElement("h1");
    heading.textContent = "फसल खर्च और मुनाफा रिपोर्ट";
    doc.body.appendChild(heading);
    const reportDate = doc.createElement("p");
    reportDate.textContent = `रिपोर्ट दिनांक: ${getLocalDate()}`;
    doc.body.appendChild(reportDate);
    const summary = doc.createElement("p");
    summary.className = "summary";
    summary.textContent = `कुल खर्च: ₹${totalExpenses.toLocaleString("en-IN")} | अनुमानित आमदनी: ₹${totalExpectedIncome.toLocaleString("en-IN")} | अनुमानित शुद्ध मुनाफा: ₹${totalExpectedProfit.toLocaleString("en-IN")}`;
    doc.body.appendChild(summary);

    const table = doc.createElement("table");
    const head = doc.createElement("thead");
    const headRow = doc.createElement("tr");
    ["फसल", "स्थिति", "रकबा", "उत्पादन (क्विंटल)", "बिक्री दर", "कुल खर्च", "प्रति एकड़ खर्च", "आमदनी", "मुनाफा"].forEach((label) => {
      const cell = doc.createElement("th");
      cell.textContent = label;
      headRow.appendChild(cell);
    });
    head.appendChild(headRow);
    table.appendChild(head);
    const body = doc.createElement("tbody");
    crops.forEach((crop) => {
      const financials = getCropFinancials(crop);
      const row = doc.createElement("tr");
      [crop.name, crop.isArchived ? "पिछली फसल" : crop.status, crop.area, crop.estimatedProductionQuintals || 0, crop.expectedSalePrice || 0, financials.totalExpenses, financials.costPerAcre, financials.expectedIncome, financials.expectedProfit].forEach((value) => {
        const cell = doc.createElement("td");
        cell.textContent = String(value ?? "—");
        row.appendChild(cell);
      });
      body.appendChild(row);
    });
    table.appendChild(body);
    doc.body.appendChild(table);
    reportWindow.focus();
    reportWindow.print();
  }

  async function handleAddCrop(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.area) {
      setError("फसल का नाम और भूमि का क्षेत्रफल भरें।");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        area: Number(form.area),
        season: form.season,
        status: form.status,
        sowingDate: form.sowingDate || "",
        estimatedProductionQuintals: Number(form.estimatedProductionQuintals) || 0,
        expectedSalePrice: Number(form.expectedSalePrice) || 0,
      };

      const res = await farmerApi.addCrop(payload);
      if (Array.isArray(res.data)) {
        setCrops(res.data);
      } else {
        await loadCrops();
      }

      setForm({
        name: "",
        area: "",
        season: "खरीफ",
        status: "बुवाई की तैयारी",
        sowingDate: "",
        estimatedProductionQuintals: "",
        expectedSalePrice: "",
      });

      setShowForm(false);
      setSuccess("फसल सफलतापूर्वक जोड़ दी गई।");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Add crop error:", err);
      setError(err.message || "फसल जोड़ने में समस्या हुई।");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCrop(id) {
    const crop = crops.find((c) => String(c._id || c.id) === String(id));
    const confirmed = window.confirm(
      `क्या आप "${crop?.name || "इस फसल"}" को हटाना चाहते हैं?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      const res = await farmerApi.deleteCrop(id);
      if (Array.isArray(res.data)) {
        setCrops(res.data);
      } else {
        setCrops((prev) => prev.filter((c) => String(c._id || c.id) !== String(id)));
      }

      setSuccess("फसल हटा दी गई।");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete crop error:", err);
      setError(err.message || "फसल हटाने में समस्या हुई।");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      const res = await farmerApi.updateCrop(id, { status: newStatus });
      if (Array.isArray(res.data)) {
        setCrops(res.data);
      } else {
        setCrops((prev) =>
          prev.map((c) =>
            String(c._id || c.id) === String(id)
              ? { ...c, status: newStatus }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Update crop status error:", err);
      setError("स्थिति बदलने में समस्या हुई।");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-emerald-400 text-sm font-semibold">मेरी खेती</p>
          <h1 className="text-3xl font-bold">मेरी फसलें</h1>
          <p className="text-slate-400 mt-1">
            अपने खेत में बोई गई सभी फसलों का लाइव रिकॉर्ड और स्थिति प्रबंधित करें।
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportCsv} disabled={!crops.length} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-40">
            <FileSpreadsheet className="h-4 w-4" /> CSV
          </button>
          <button type="button" onClick={exportPdf} disabled={!crops.length} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-40">
            <FileDown className="h-4 w-4" /> PDF
          </button>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setError("");
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
          >
            {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {showForm ? "फॉर्म बंद करें" : "नई फसल जोड़ें"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3.5 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-3.5 flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {crops.length > 0 && (
        <>
          <section className="grid gap-3 sm:grid-cols-3">
            <FinanceSummary label="कुल खेती खर्च" value={totalExpenses} tone="text-amber-300" />
            <FinanceSummary label="अनुमानित आमदनी" value={totalExpectedIncome} tone="text-sky-300" />
            <FinanceSummary label="अनुमानित शुद्ध मुनाफा" value={totalExpectedProfit} tone={totalExpectedProfit >= 0 ? "text-emerald-300" : "text-rose-300"} />
          </section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900 p-1">
              <button type="button" onClick={() => setCropView("active")} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${cropView === "active" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"}`}>
                सक्रिय फसलें ({activeCrops.length})
              </button>
              <button type="button" onClick={() => setCropView("history")} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${cropView === "history" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"}`}>
                पिछली फसलें ({archivedCrops.length})
              </button>
            </div>
            <p className="text-[11px] text-slate-500">मुनाफा = अनुमानित उत्पादन × बिक्री दर − दर्ज खर्च</p>
          </div>
        </>
      )}

      {priceError && (
        <div role="status" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
          मंडी भाव: {priceError}
        </div>
      )}

      {/* Add Crop Form */}
      {showForm && (
        <form
          onSubmit={handleAddCrop}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="min-w-0 font-bold text-base sm:text-lg text-white flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-400" />
              नई फसल का विवरण दर्ज करें
            </h2>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                फसल का नाम *
              </label>
              <input
                placeholder="जैसे सोयाबीन, गेहूँ, लहसुन"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm outline-none focus:border-emerald-500 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                रकबा / भूमि (एकड़) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="जैसे 2.5"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm outline-none focus:border-emerald-500 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                फसल मौसम
              </label>
              <select
                value={form.season}
                onChange={(e) => setForm({ ...form, season: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm outline-none focus:border-emerald-500 text-white"
              >
                <option value="खरीफ">खरीफ (Kharif)</option>
                <option value="रबी">रबी (Rabi)</option>
                <option value="जायद">जायद (Zaid)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                वर्तमान स्थिति
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm outline-none focus:border-emerald-500 text-white"
              >
                <option value="बुवाई की तैयारी">बुवाई की तैयारी</option>
                <option value="बुवाई हो चुकी है">बुवाई हो चुकी है</option>
                <option value="फसल बढ़ रही है">फसल बढ़ रही है</option>
                <option value="फूल/फल आने लगे हैं">फूल/फल आने लगे हैं</option>
                <option value="कटाई के लिए तैयार">कटाई के लिए तैयार</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                बुवाई की तिथि (वैकल्पिक)
              </label>
              <input
                type="date"
                value={form.sowingDate}
                onChange={(e) => setForm({ ...form, sowingDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm outline-none focus:border-emerald-500 text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                अनुमानित उत्पादन (क्विंटल)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.estimatedProductionQuintals}
                onChange={(e) => setForm({ ...form, estimatedProductionQuintals: e.target.value })}
                placeholder="कुल उत्पादन"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                अपेक्षित बिक्री दर (₹/क्विंटल)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.expectedSalePrice}
                onChange={(e) => setForm({ ...form, expectedSalePrice: e.target.value })}
                placeholder="अनुमानित दर"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold"
            >
              रद्द करें
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  सुरक्षित हो रहा है...
                </>
              ) : (
                "फसल सुरक्षित करें"
              )}
            </button>
          </div>
        </form>
      )}

      {/* Crops List */}
      {loading && crops.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
          <p className="text-slate-400">आपकी फसलें लोड हो रही हैं...</p>
        </div>
      ) : crops.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-6 sm:p-12 text-center">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 mb-4">
            <Sprout className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-white">अभी कोई फसल नहीं जोड़ी गई है</h3>
          <p className="text-slate-400 mt-2 max-w-md mx-auto text-sm">
            अपनी बुवाई की गई फसलों को जोड़ें ताकि आप उनके अनुसार मौसम सलाह, कीट नियंत्रण और मंडी भाव ट्रैक कर सकें।
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="mt-5 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition"
          >
            <Plus className="w-4 h-4" />
            पहली फसल जोड़ें
          </button>
        </div>
      ) : visibleCrops.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center text-sm text-slate-400">
          {cropView === "history" ? "अभी कोई पिछली फसल रिपोर्ट नहीं है।" : "सभी फसलें इतिहास में रखी गई हैं।"}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visibleCrops.map((crop) => {
            const cropId = crop._id || crop.id;
            const isDeleting = deletingId === cropId;
            const financials = getCropFinancials(crop);
            const marketPrice = cropPrices.find((row) =>
              cropNamesMatch(crop.name, row.commodity || row.crop)
            );
            const expenses = crop.expenses || [];
            const cropExpenseTotal = expenses.reduce(
              (total, expense) => total + Number(expense.amount || 0),
              0
            );
            const isExpenseFormOpen = expenseCropId === String(cropId);
            const isEstimateFormOpen = editingEstimateId === String(cropId);

            return (
              <div
                key={cropId}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition shadow-md"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <Sprout className="w-6 h-6 text-emerald-400" />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleArchiveCrop(crop)}
                        title={crop.isArchived ? "सक्रिय फसलों में लौटाएं" : "पिछली फसल रिपोर्ट में रखें"}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-emerald-300"
                      >
                        {crop.isArchived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteCrop(cropId)}
                        disabled={isDeleting}
                        title="फसल हटाएं"
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold mt-4 text-white">
                    {crop.name}
                  </h2>

                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mt-1">
                    <span>{crop.area} Acre</span>
                    <span>•</span>
                    <span className="text-slate-400 font-normal">
                      {crop.season} मौसम
                    </span>
                  </div>

                  {crop.sowingDate && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                      बुवाई तिथि: {crop.sowingDate}
                    </div>
                  )}

                  <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                        मंडी भाव
                      </h3>
                      {loadingPrices && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                      )}
                    </div>
                    {marketPrice ? (
                      <>
                        <p className="mt-1 text-[10px] text-slate-500">
                          उपलब्ध भाव: {formatMandiDateDisplay(marketPrice.priceDate || marketPrice.date)}
                        </p>
                        <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
                          <PriceValue label="न्यूनतम" value={marketPrice.minPrice} />
                          <PriceValue label="मॉडल" value={marketPrice.modalPrice} highlight />
                          <PriceValue label="अधिकतम" value={marketPrice.maxPrice} />
                        </div>
                      </>
                    ) : (
                      <p className="mt-2 text-[11px] text-slate-500">
                        {loadingPrices ? "भाव खोजे जा रहे हैं…" : "इस फसल का भाव उपलब्ध नहीं है।"}
                      </p>
                    )}
                  </section>

                  <section className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-slate-200">खेती का खर्च और मुनाफा</h3>
                        <p className="mt-1 text-[10px] text-slate-500">प्रति एकड़ लागत: ₹{Math.round(financials.costPerAcre).toLocaleString("en-IN")}</p>
                      </div>
                      <button type="button" onClick={() => isEstimateFormOpen ? setEditingEstimateId("") : openEstimateForm(crop)} className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-emerald-500/30 px-2 py-1.5 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/10">
                        {isEstimateFormOpen ? <X className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
                        {isEstimateFormOpen ? "बंद" : "अनुमान बदलें"}
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <FinanceValue label="कुल खर्च" value={financials.totalExpenses} />
                      <FinanceValue label="अनुमानित आमदनी" value={financials.expectedIncome} />
                      <FinanceValue label="अनुमानित उत्पादन" value={`${Number(crop.estimatedProductionQuintals || 0).toLocaleString("en-IN")} क्विंटल`} />
                      <FinanceValue label="शुद्ध मुनाफा" value={financials.expectedProfit} highlight={financials.expectedProfit >= 0} />
                    </div>
                    {crop.expectedSalePrice > 0 && (
                      <p className="mt-2 text-[10px] text-slate-500">बिक्री अनुमान: ₹{Number(crop.expectedSalePrice).toLocaleString("en-IN")} / क्विंटल</p>
                    )}
                    {isEstimateFormOpen && (
                      <form onSubmit={(event) => handleEstimateSubmit(event, cropId)} className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800 pt-3">
                        <input type="number" min="0" step="0.01" value={estimateForm.production} onChange={(event) => setEstimateForm((previous) => ({ ...previous, production: event.target.value }))} placeholder="उत्पादन (क्विंटल)" aria-label="अनुमानित उत्पादन क्विंटल में" className="min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white outline-none focus:border-emerald-500" />
                        <input type="number" min="0" step="0.01" value={estimateForm.salePrice} onChange={(event) => setEstimateForm((previous) => ({ ...previous, salePrice: event.target.value }))} placeholder="बिक्री दर ₹/क्विंटल" aria-label="अपेक्षित बिक्री दर" className="min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white outline-none focus:border-emerald-500" />
                        <button type="submit" disabled={savingEstimate} className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-60">
                          {savingEstimate ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                          अनुमान सुरक्षित करें
                        </button>
                      </form>
                    )}
                  </section>

                  <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-slate-200">फसल खर्च</h3>
                        <p className="mt-0.5 text-[11px] text-emerald-300">
                          कुल ₹{cropExpenseTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          isExpenseFormOpen
                            ? setExpenseCropId("")
                            : openExpenseForm(cropId)
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300 transition hover:bg-emerald-500/10"
                      >
                        {isExpenseFormOpen ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        {isExpenseFormOpen ? "बंद करें" : "खर्च जोड़ें"}
                      </button>
                    </div>

                    {expenses.length > 0 ? (
                      <div className="mt-3 max-h-44 space-y-2 overflow-y-auto">
                        {expenses.map((expense) => {
                          const expenseId = expense._id || expense.id;
                          return (
                            <div key={expenseId} className="flex items-center justify-between gap-2 border-t border-slate-800 pt-2 first:border-0 first:pt-0">
                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-slate-200">{expense.category}</p>
                                <p className="text-[10px] text-slate-500">
                                  {expense.stage || "बुवाई"} · {formatMandiDateDisplay(expense.date)}{expense.note ? ` · ${expense.note}` : ""}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-1">
                                <span className="mr-1 text-xs font-bold text-white">
                                  ₹{Number(expense.amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                                </span>
                                <button type="button" onClick={() => openExpenseForm(cropId, expense)} title="खर्च संपादित करें" className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button type="button" onClick={() => handleDeleteExpense(cropId, expenseId)} title="खर्च हटाएं" className="rounded-md p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-300">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-3 text-[11px] text-slate-500">अभी कोई खर्च दर्ज नहीं है।</p>
                    )}

                    {isExpenseFormOpen && (
                      <form onSubmit={(event) => handleExpenseSubmit(event, cropId)} className="mt-3 space-y-2 border-t border-slate-800 pt-3">
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={expenseForm.category}
                            onChange={(event) => setExpenseForm((prev) => ({ ...prev, category: event.target.value }))}
                            aria-label="खर्च का प्रकार"
                            className="min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white outline-none focus:border-emerald-500"
                          >
                            {["बीज", "खाद एवं उर्वरक", "कीटनाशक", "मजदूरी", "सिंचाई", "डीजल/ईंधन", "मशीनरी", "अन्य"].map((category) => <option key={category}>{category}</option>)}
                          </select>
                          <select
                            value={expenseForm.stage}
                            onChange={(event) => setExpenseForm((previous) => ({ ...previous, stage: event.target.value }))}
                            aria-label="खर्च का फसल चरण"
                            className="min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white outline-none focus:border-emerald-500"
                          >
                            {EXPENSE_STAGES.map((stage) => <option key={stage}>{stage}</option>)}
                          </select>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            required
                            value={expenseForm.amount}
                            onChange={(event) => setExpenseForm((prev) => ({ ...prev, amount: event.target.value }))}
                            placeholder="राशि (₹)"
                            aria-label="खर्च की राशि"
                            className="min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white outline-none focus:border-emerald-500"
                          />
                          <input
                            type="date"
                            required
                            value={expenseForm.date}
                            onChange={(event) => setExpenseForm((prev) => ({ ...prev, date: event.target.value }))}
                            aria-label="खर्च की तारीख"
                            className="min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white outline-none focus:border-emerald-500"
                          />
                          <input
                            value={expenseForm.note}
                            onChange={(event) => setExpenseForm((prev) => ({ ...prev, note: event.target.value }))}
                            placeholder="नोट (वैकल्पिक)"
                            aria-label="खर्च का नोट"
                            maxLength={300}
                            className="min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white outline-none focus:border-emerald-500"
                          />
                        </div>
                        <button type="submit" disabled={savingExpense} className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60">
                          {savingExpense ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                          {editingExpenseId ? "खर्च अपडेट करें" : "खर्च सुरक्षित करें"}
                        </button>
                      </form>
                    )}
                  </section>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400">स्थिति:</span>

                  <select
                    value={crop.status || "बुवाई की तैयारी"}
                    onChange={(e) => handleStatusChange(cropId, e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-emerald-400 text-xs font-semibold rounded-lg px-2.5 py-1.5 outline-none focus:border-emerald-500"
                  >
                    <option value="बुवाई की तैयारी">बुवाई की तैयारी</option>
                    <option value="बुवाई हो चुकी है">बुवाई हो चुकी है</option>
                    <option value="फसल बढ़ रही है">फसल बढ़ रही है</option>
                    <option value="फूल/फल आने लगे हैं">फूल/फल आने लगे हैं</option>
                    <option value="कटाई के लिए तैयार">कटाई के लिए तैयार</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PriceValue({ label, value, highlight = false }) {
  return (
    <div className="min-w-0 rounded-lg bg-slate-900 px-1.5 py-2">
      <p className="truncate text-[9px] font-medium text-slate-500">{label}</p>
      <p className={`mt-0.5 truncate text-[11px] font-bold ${highlight ? "text-emerald-300" : "text-slate-200"}`}>
        {formatMandiPrice(value)}
      </p>
    </div>
  );
}

function FinanceSummary({ label, value, tone }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className={`mt-2 text-xl font-black ${tone}`}>
        ₹{Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
      </p>
    </div>
  );
}

function FinanceValue({ label, value, highlight = false }) {
  const formattedValue =
    typeof value === "number"
      ? `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
      : value;

  return (
    <div className="min-w-0 rounded-lg bg-slate-900 px-2 py-2">
      <p className="truncate text-[9px] font-medium text-slate-500">{label}</p>
      <p className={`mt-0.5 truncate text-[11px] font-bold ${highlight ? "text-emerald-300" : "text-slate-200"}`}>
        {formattedValue}
      </p>
    </div>
  );
}