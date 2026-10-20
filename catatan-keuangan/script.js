'use strict';

const STORAGE_KEYS = { expenses: 'catatuang_expenses_v1', budget: 'catatuang_budget_v1' };
const CATEGORY_ICONS = {
  Makanan: '🍜', Transportasi: '🚌', Belanja: '🛍️', Tagihan: '💡',
  Pendidikan: '📚', Hiburan: '🎮', Kesehatan: '🩺', Lainnya: '📦'
};
const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0
});
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric'
});
const $ = (selector) => document.querySelector(selector);

const elements = {
  todayLabel: $('#todayLabel'), monthTotal: $('#monthTotal'), monthCount: $('#monthCount'),
  budgetTotal: $('#budgetTotal'), remainingTotal: $('#remainingTotal'), budgetStatus: $('#budgetStatus'),
  budgetForm: $('#budgetForm'), budgetInput: $('#budgetInput'), budgetPercent: $('#budgetPercent'),
  budgetProgress: $('#budgetProgress'), budgetProgressFill: $('#budgetProgressFill'),
  spentLabel: $('#spentLabel'), leftLabel: $('#leftLabel'), expenseForm: $('#expenseForm'),
  expenseName: $('#expenseName'), expenseAmount: $('#expenseAmount'), expenseCategory: $('#expenseCategory'),
  expenseDate: $('#expenseDate'), expenseNote: $('#expenseNote'), formMessage: $('#formMessage'),
  transactionCount: $('#transactionCount'), searchInput: $('#searchInput'), categoryFilter: $('#categoryFilter'),
  expenseList: $('#expenseList'), visibleSummary: $('#visibleSummary'), clearAllButton: $('#clearAllButton'),
  confirmDialog: $('#confirmDialog'), cancelClear: $('#cancelClear'), confirmClear: $('#confirmClear')
};

function readExpenses() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.expenses) || '[]');
    if (!Array.isArray(saved)) return [];
    return saved.filter((item) => item && typeof item.id === 'string' &&
      typeof item.name === 'string' && Number.isFinite(item.amount) && item.amount > 0 &&
      typeof item.category === 'string' && typeof item.date === 'string');
  } catch (error) {
    console.warn('Catatan pengeluaran tidak dapat dibaca.', error);
    return [];
  }
}

function readBudget() {
  const value = Number(localStorage.getItem(STORAGE_KEYS.budget));
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

let expenses = readExpenses();
let budget = readBudget();

function saveExpenses() {
  try {
    localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
    return true;
  } catch (error) {
    console.error('Pengeluaran tidak dapat disimpan.', error);
    showMessage('Penyimpanan browser penuh atau tidak tersedia. Data mungkin tidak tersimpan.', true);
    return false;
  }
}

function saveBudget() {
  try {
    localStorage.setItem(STORAGE_KEYS.budget, String(budget));
  } catch (error) {
    console.error('Anggaran tidak dapat disimpan.', error);
    showMessage('Anggaran tidak dapat disimpan di browser ini.', true);
  }
}

function formatMoney(value) {
  return rupiah.format(value).replace(/\u00a0/g, ' ');
}

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function isThisMonth(expense) {
  return expense.date.slice(0, 7) === currentMonthKey();
}

function parseLocalDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function showMessage(message, isError = false) {
  elements.formMessage.textContent = message;
  elements.formMessage.classList.toggle('error', isError);
}

function renderSummary() {
  const monthExpenses = expenses.filter(isThisMonth);
  const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = budget - total;
  const usedPercent = budget > 0 ? Math.round((total / budget) * 100) : 0;
  const visualPercent = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;

  elements.monthTotal.textContent = formatMoney(total);
  elements.monthCount.textContent = `${monthExpenses.length} transaksi bulan ini`;
  elements.budgetTotal.textContent = formatMoney(budget);
  elements.remainingTotal.textContent = formatMoney(remaining);
  elements.remainingTotal.style.color = remaining < 0 ? 'var(--coral)' : '';
  elements.budgetStatus.textContent = budget <= 0
    ? 'Atur anggaran untuk memulai'
    : remaining < 0 ? `Melebihi anggaran ${formatMoney(Math.abs(remaining))}` : 'Anggaran masih terkendali';
  elements.budgetPercent.textContent = budget > 0 ? `${usedPercent}%` : '0%';
  elements.budgetProgressFill.style.width = `${visualPercent}%`;
  elements.budgetProgressFill.classList.toggle('over-budget', budget > 0 && total > budget);
  elements.budgetProgress.setAttribute('aria-valuenow', String(Math.min(usedPercent, 100)));
  elements.spentLabel.textContent = `Terpakai ${formatMoney(total)}`;
  elements.leftLabel.textContent = budget > 0
    ? (remaining >= 0 ? `Sisa ${formatMoney(remaining)}` : `Lebih ${formatMoney(Math.abs(remaining))}`)
    : 'Anggaran belum diatur';
  elements.budgetInput.value = budget > 0 ? String(budget) : '';
  elements.transactionCount.textContent = `${expenses.length} transaksi`;
}

function createExpenseElement(expense) {
  const item = document.createElement('article');
  item.className = 'expense-item';

  const icon = document.createElement('div');
  icon.className = 'category-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.Lainnya;

  const details = document.createElement('div');
  details.className = 'expense-details';
  const name = document.createElement('div');
  name.className = 'expense-name';
  name.textContent = expense.name;
  const meta = document.createElement('div');
  meta.className = 'expense-meta';
  const category = document.createElement('span');
  category.textContent = expense.category;
  const date = document.createElement('span');
  date.textContent = dateFormatter.format(parseLocalDate(expense.date));
  meta.append(category, date);
  if (expense.note) {
    const note = document.createElement('span');
    note.textContent = `· ${expense.note}`;
    meta.append(note);
  }
  details.append(name, meta);

  const amount = document.createElement('div');
  amount.className = 'expense-value';
  amount.textContent = formatMoney(expense.amount);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-item';
  deleteButton.textContent = '×';
  deleteButton.setAttribute('aria-label', `Hapus pengeluaran ${expense.name}`);
  deleteButton.addEventListener('click', () => deleteExpense(expense.id));

  item.append(icon, details, amount, deleteButton);
  return item;
}

function renderExpenses() {
  const query = elements.searchInput.value.trim().toLocaleLowerCase('id-ID');
  const selectedCategory = elements.categoryFilter.value;
  const filtered = expenses.filter((expense) => {
    const matchesQuery = `${expense.name} ${expense.note || ''} ${expense.category}`.toLocaleLowerCase('id-ID').includes(query);
    const matchesCategory = selectedCategory === 'Semua' || expense.category === selectedCategory;
    return matchesQuery && matchesCategory;
  }).sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  elements.expenseList.replaceChildren();
  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const image = document.createElement('div');
    image.className = 'empty-illustration';
    image.textContent = query || selectedCategory !== 'Semua' ? '⌕' : '＋';
    const title = document.createElement('strong');
    title.textContent = query || selectedCategory !== 'Semua' ? 'Transaksi tidak ditemukan' : 'Belum ada pengeluaran';
    const text = document.createElement('p');
    text.textContent = query || selectedCategory !== 'Semua'
      ? 'Coba kata kunci atau kategori lain.'
      : 'Tambahkan transaksi pertamamu melalui formulir.';
    empty.append(image, title, text);
    elements.expenseList.append(empty);
  } else {
    const fragment = document.createDocumentFragment();
    filtered.forEach((expense) => fragment.append(createExpenseElement(expense)));
    elements.expenseList.append(fragment);
  }

  const visibleTotal = filtered.reduce((sum, expense) => sum + expense.amount, 0);
  elements.visibleSummary.textContent = `Total tampilan: ${formatMoney(visibleTotal)}`;
}

function renderAll() {
  renderSummary();
  renderExpenses();
}

function deleteExpense(id) {
  const selected = expenses.find((expense) => expense.id === id);
  if (!selected) return;
  expenses = expenses.filter((expense) => expense.id !== id);
  if (saveExpenses()) {
    renderAll();
    showMessage(`Pengeluaran "${selected.name}" berhasil dihapus.`);
  }
}

elements.expenseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = elements.expenseName.value.trim();
  const amount = Number(elements.expenseAmount.value);
  const category = elements.expenseCategory.value;
  const date = elements.expenseDate.value;
  const note = elements.expenseNote.value.trim();

  if (!name) return showMessage('Nama pengeluaran wajib diisi.', true);
  if (!Number.isSafeInteger(amount) || amount <= 0) return showMessage('Jumlah harus berupa angka rupiah positif yang valid.', true);
  if (!date || Number.isNaN(parseLocalDate(date).getTime())) return showMessage('Pilih tanggal transaksi yang valid.', true);
  if (!Object.hasOwn(CATEGORY_ICONS, category)) return showMessage('Pilih kategori yang tersedia.', true);

  const newExpense = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, name, amount, category, date, note };
  expenses.push(newExpense);
  if (saveExpenses()) {
    elements.expenseForm.reset();
    elements.expenseDate.value = new Date().toLocaleDateString('en-CA');
    elements.expenseCategory.value = 'Makanan';
    showMessage('Pengeluaran berhasil ditambahkan.');
    renderAll();
    elements.expenseName.focus();
  }
});

elements.budgetForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = Number(elements.budgetInput.value);
  if (!Number.isSafeInteger(value) || value < 0) {
    showMessage('Anggaran harus berupa angka rupiah yang valid.', true);
    return;
  }
  budget = value;
  saveBudget();
  renderSummary();
  showMessage('Anggaran bulanan berhasil disimpan.');
});

elements.searchInput.addEventListener('input', renderExpenses);
elements.categoryFilter.addEventListener('change', renderExpenses);

elements.clearAllButton.addEventListener('click', () => {
  if (expenses.length === 0) {
    showMessage('Belum ada transaksi yang perlu dihapus.', true);
    return;
  }
  elements.confirmDialog.hidden = false;
  elements.confirmClear.focus();
});

elements.cancelClear.addEventListener('click', () => {
  elements.confirmDialog.hidden = true;
  elements.clearAllButton.focus();
});

elements.confirmClear.addEventListener('click', () => {
  expenses = [];
  saveExpenses();
  elements.confirmDialog.hidden = true;
  renderAll();
  showMessage('Semua catatan pengeluaran berhasil dihapus.');
  elements.clearAllButton.focus();
});

elements.confirmDialog.addEventListener('click', (event) => {
  if (event.target === elements.confirmDialog) elements.cancelClear.click();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !elements.confirmDialog.hidden) elements.cancelClear.click();
});

const today = new Date();
elements.expenseDate.value = today.toLocaleDateString('en-CA');
elements.todayLabel.textContent = dateFormatter.format(today);
renderAll();
