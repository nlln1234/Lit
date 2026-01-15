(async () => {
    const { LitElement, html, css, nothing } = await window.__litPromise;

    class BankingOverviewDashboard extends LitElement {
        static properties = {
            activeTab: { state: true },
            data: { state: true },
            chartInstance: { state: false },

            // External Input
            accountsData: { type: Array },

            // Interactive State
            sortState: { state: true },
            selectedAccountId: { state: true },
            searchQuery: { state: true },
            modalOpen: { state: true },
            selectedAccountDetail: { state: true }
        };

        static styles = css`
            :host {
                display: block;
                font-family: 'Noto Sans KR', sans-serif;
                color: #1f2937;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            .header { margin-bottom: 24px; }
            .header h1 {
                font-size: 24px;
                font-weight: 700;
                margin: 0;
                color: #111827;
            }

            /* KPI Grid */
            .kpi-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .card {
                background: #ffffff;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .kpi-card h3 {
                margin: 0;
                font-size: 14px;
                color: #6b7280;
                font-weight: 500;
            }
            .kpi-card .value {
                font-size: 28px;
                font-weight: 700;
                margin-top: 8px;
                color: #111827;
            }
            .kpi-card .trend {
                font-size: 13px;
                margin-top: 4px;
                display: flex;
                align-items: center;
            }
            .trend.up { color: #10b981; }
            .trend.down { color: #ef4444; }

            /* Dashboard Content */
            .dashboard-content {
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                display: grid;
                grid-template-columns: 400px 1fr;
                min-height: 600px;
            }
            
            @media (max-width: 1024px) {
                .dashboard-content { grid-template-columns: 1fr; }
            }

            .chart-section {
                padding: 24px;
                border-right: 1px solid #e5e7eb;
                background: #fafafa;
            }
            .grid-section {
                padding: 24px;
                display: flex;
                flex-direction: column;
                background-color: white;
            }

            .section-title {
                font-size: 16px;
                font-weight: 700;
                margin-bottom: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .reset-btn {
                font-size: 12px;
                color: #4f46e5;
                background: none;
                border: 1px solid #4f46e5;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                visibility: hidden;
            }
            .reset-btn.visible { visibility: visible; }

            .chart-container {
                position: relative;
                height: 350px;
                width: 100%;
            }

            /* Controls */
            .grid-controls {
                display: flex;
                gap: 10px;
                margin-bottom: 16px;
            }

             .search-input {
                flex: 1;
                padding: 10px 12px;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            }
            .search-input:focus {
                border-color: #4f46e5;
                box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
            }

            .export-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 10px 16px;
                background-color: #10b981;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .export-btn:hover { background-color: #059669; }

            /* Table */
            .table-container {
                flex: 1;
                overflow-y: auto;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            th {
                text-align: left;
                padding: 12px 16px;
                border-bottom: 2px solid #e5e7eb;
                color: #6b7280;
                font-weight: 600;
                cursor: pointer;
                user-select: none;
                position: sticky;
                top: 0;
                background: #fff;
                z-index: 10;
            }
            th:hover { color: #4f46e5; }
            th::after { content: '↕'; font-size: 10px; margin-left: 4px; opacity: 0.3; }
            th.sort-asc::after { content: '↑'; opacity: 1; color: #4f46e5; }
            th.sort-desc::after { content: '↓'; opacity: 1; color: #4f46e5; }

            td {
                padding: 12px 16px;
                border-bottom: 1px solid #e5e7eb;
                color: #374151;
            }
            tr { transition: background-color 0.2s; cursor: pointer; }
            tr:hover { background-color: #f9fafb; }
            
            tr.highlight td {
                background-color: #e0e7ff;
                font-weight: 600;
            }

            .status-badge {
                padding: 2px 8px;
                border-radius: 9999px;
                font-size: 11px;
                font-weight: 500;
            }
            .status-active { background-color: #d1fae5; color: #065f46; }
            .status-inactive { background-color: #fee2e2; color: #991b1b; }
            .currency { font-family: monospace; font-weight: 600; }

            /* Modal */
            .modal-overlay {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 100;
            }
            .modal-container {
                background: white;
                border-radius: 12px;
                width: 100%;
                max-width: 500px;
                padding: 30px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: start;
                margin-bottom: 20px;
            }
            .modal-header h2 {
                margin: 0;
                font-size: 20px;
                color: #111827;
            }
            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                color: #9ca3af;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .close-btn:hover { color: #111827; }
            .modal-body {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            .detail-item { margin-bottom: 10px; }
            .detail-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
            .detail-value { font-size: 14px; color: #111827; font-weight: 500; }
        `;

        constructor() {
            super();
            this.activeTab = 'overview';
            this.chartInstance = null;
            this.sortState = { key: 'Balance', dir: 'desc' };
            this.selectedAccountId = null;
            this.searchQuery = '';
            this.modalOpen = false;
            this.selectedAccountDetail = null;

            // External Input Default
            this.accountsData = [];
            this.data = []; // Start empty
        }

        firstUpdated() {
            this._loadChartJs();
        }

        willUpdate(changedProperties) {
            // Watch 'accountsData' input
            if (changedProperties.has('accountsData')) {
                this._parseInputData();
            }
        }

        _parseInputData() {
            let input = this.accountsData;

            // Handle JSON string input (Common in OS)
            if (typeof input === 'string') {
                try {
                    input = JSON.parse(input);
                } catch (e) {
                    console.error("Failed to parse accountsData JSON:", e);
                    return;
                }
            }

            if (!input || !Array.isArray(input)) {
                return;
            }

            // Flatten logic: Check if wrapped in Sample_Accounts
            this.data = input.map(item => {
                return item.Sample_Accounts ? item.Sample_Accounts : item;
            });
        }

        updated(changedProperties) {
            if (changedProperties.has('selectedAccountId') || changedProperties.has('data')) {
                if (this.chartInstance) {
                    this._renderChart();
                }
            }
        }

        async _loadChartJs() {
            if (window.Chart) {
                this._renderChart();
                return;
            }
            try {
                const ChartModule = await import('https://esm.sh/chart.js/auto');
                window.Chart = ChartModule.default;
                this._renderChart();
            } catch (e) {
                console.error("Failed to load Chart.js", e);
            }
        }

        _renderChart() {
            const ctx = this.shadowRoot.getElementById('balanceChart');
            if (!ctx || !window.Chart) return;

            if (this.chartInstance) {
                this.chartInstance.destroy();
            }

            const sortedForChart = [...this.data].sort((a, b) => b.Balance - a.Balance).slice(0, 10);

            const backgroundColors = sortedForChart.map(acc =>
                acc.Id === this.selectedAccountId ? '#ef4444' : '#4f46e5'
            );

            this.chartInstance = new window.Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedForChart.map(a => a.Name.split(' ')[0]),
                    datasets: [{
                        label: 'Balance',
                        data: sortedForChart.map(a => a.Balance),
                        backgroundColor: backgroundColors,
                        borderRadius: 4,
                        barThickness: 20
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    onClick: (e, elements) => {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            this._handleChartClick(sortedForChart[index].Id);
                        } else {
                            this._resetFilter();
                        }
                    },
                    onHover: (event, chartElement) => {
                        event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: (c) => '$' + c.raw.toLocaleString() } }
                    },
                    scales: {
                        y: { beginAtZero: true, grid: { display: true, borderDash: [2, 2] } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        _handleChartClick(id) {
            this.selectedAccountId = id;
        }

        _resetFilter() {
            this.selectedAccountId = null;
        }

        _handleSearch(e) {
            this.searchQuery = e.target.value;
        }

        _sortTable(key) {
            if (this.sortState.key === key) {
                this.sortState = { key, dir: this.sortState.dir === 'asc' ? 'desc' : 'asc' };
            } else {
                this.sortState = { key, dir: 'desc' };
            }
            this.requestUpdate();
        }

        _openModal(account) {
            this.selectedAccountDetail = account;
            this.modalOpen = true;
        }

        _closeModal() {
            this.modalOpen = false;
            this.selectedAccountDetail = null;
        }

        _exportToCSV() {
            const data = this._processedList;
            if (!data.length) {
                alert('No data to export');
                return;
            }

            const headers = ["ID", "Name", "AccountNumber", "Balance", "IsActive", "CreatedOn"];
            const csvRows = [];
            csvRows.push(headers.join(','));

            data.forEach(row => {
                const values = headers.map(header => `"${row[header] !== undefined ? row[header] : ''}"`);
                csvRows.push(values.join(','));
            });

            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "banking_data.csv");
            document.body.appendChild(link); // Required for Firefox
            link.click();
            document.body.removeChild(link);
        }

        get _processedList() {
            let filtered = [...this.data];

            // Search
            if (this.searchQuery) {
                const q = this.searchQuery.toLowerCase();
                filtered = filtered.filter(a =>
                    a.Name.toLowerCase().includes(q) ||
                    String(a.AccountNumber).includes(q)
                );
            }

            // Chart Filter
            if (this.selectedAccountId) {
                filtered = filtered.filter(a => a.Id === this.selectedAccountId);
            }

            // Sort
            filtered.sort((a, b) => {
                let valA = a[this.sortState.key];
                let valB = b[this.sortState.key];

                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();

                if (valA < valB) return this.sortState.dir === 'asc' ? -1 : 1;
                if (valA > valB) return this.sortState.dir === 'asc' ? 1 : -1;
                return 0;
            });

            return filtered;
        }

        _getSortClass(key) {
            if (this.sortState.key !== key) return '';
            return this.sortState.dir === 'asc' ? 'sort-asc' : 'sort-desc';
        }

        get kpi() {
            const total = this.data.reduce((sum, acc) => sum + acc.Balance, 0);
            const activeCount = this.data.filter(acc => acc.IsActive).length;
            const avg = total / (this.data.length || 1);
            return { total, activeCount, avg };
        }

        _formatCurrency(val) {
            return '$' + Math.round(val).toLocaleString();
        }

        render() {
            const { total, activeCount, avg } = this.kpi;

            return html`
                <div class="container">
                    <div class="header">
                        <h1>Banking Overview</h1>
                    </div>

                    <!-- KPI Cards -->
                    <div class="kpi-grid">
                        <div class="card kpi-card">
                            <h3>Total Assets</h3>
                            <div class="value">${this._formatCurrency(total)}</div>
                            <div class="trend up">▲ 2.5% vs last month</div>
                        </div>
                        <div class="card kpi-card">
                            <h3>Active Accounts</h3>
                            <div class="value">${activeCount}</div>
                            <div class="trend up">▲ 12 new accounts</div>
                        </div>
                        <div class="card kpi-card">
                            <h3>Avg. Balance</h3>
                            <div class="value">${this._formatCurrency(avg)}</div>
                            <div class="trend down">▼ 1.2% vs last month</div>
                        </div>
                    </div>

                    <!-- Dashboard Content -->
                    <div class="dashboard-content">
                        <!-- Chart Section -->
                         <div class="chart-section">
                            <div class="section-title">
                                Top Accounts
                                <button class="reset-btn ${this.selectedAccountId ? 'visible' : ''}"
                                        @click="${this._resetFilter}">
                                    Reset Selection
                                </button>
                            </div>
                            <div class="chart-container">
                                <canvas id="balanceChart"></canvas>
                            </div>
                            <p style="font-size: 13px; color: #6b7280; margin-top: 16px; text-align: center;">
                                Select a bar to highlight details.
                            </p>
                        </div>

                        <!-- Grid Section -->
                        <div class="grid-section">
                            <div class="section-title">Account List</div>
                            
                            <div class="grid-controls">
                                <input type="text" class="search-input" 
                                       placeholder="Search by Name or Account No..." 
                                       .value="${this.searchQuery}"
                                       @input="${this._handleSearch}">
                                <button class="export-btn" @click="${this._exportToCSV}">
                                    ⬇ Export CSV
                                </button>
                            </div>

                            <div class="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th class="${this._getSortClass('Name')}" 
                                                @click="${() => this._sortTable('Name')}">Name</th>
                                            <th class="${this._getSortClass('Balance')}" 
                                                @click="${() => this._sortTable('Balance')}">Balance</th>
                                            <th class="${this._getSortClass('IsActive')}" 
                                                @click="${() => this._sortTable('IsActive')}">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${this._processedList.length > 0 ? this._processedList.map(acc => html`
                                            <tr class="${acc.Id === this.selectedAccountId ? 'highlight' : ''}"
                                                @click="${() => this._openModal(acc)}">
                                                <td>
                                                    <div style="font-weight: 500; color: #111827;">${acc.Name}</div>
                                                    <div style="font-size: 11px; color: #9ca3af;">****${String(acc.AccountNumber).slice(-4)}</div>
                                                </td>
                                                <td class="currency" style="color: ${acc.Balance > 50000 ? '#4f46e5' : '#374151'}">
                                                    ${this._formatCurrency(acc.Balance)}
                                                </td>
                                                <td>
                                                    <span class="status-badge ${acc.IsActive ? 'status-active' : 'status-inactive'}">
                                                        ${acc.IsActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                            </tr>
                                        `) : html`
                                            <tr><td colspan="3" style="text-align:center; padding: 20px;">No records found</td></tr>
                                        `}
                                    </tbody>
                                </table>
                            </div>
                            <div style="margin-top: 10px; font-size: 12px; color: #6b7280; text-align: right;">
                                * Click row to view full details
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal -->
                ${this.modalOpen && this.selectedAccountDetail ? html`
                    <div class="modal-overlay" @click="${(e) => e.target.classList.contains('modal-overlay') && this._closeModal()}">
                        <div class="modal-container">
                            <div class="modal-header">
                                <div>
                                    <h2>${this.selectedAccountDetail.Name}</h2>
                                    <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">ID: #${this.selectedAccountDetail.Id}</div>
                                </div>
                                <button class="close-btn" @click="${this._closeModal}">×</button>
                            </div>
                            <div class="modal-body">
                                <div class="detail-item">
                                    <div class="detail-label">Account Number</div>
                                    <div class="detail-value">${this.selectedAccountDetail.AccountNumber}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Current Balance</div>
                                    <div class="detail-value" style="color: #4f46e5; font-size: 16px;">
                                        ${this._formatCurrency(this.selectedAccountDetail.Balance)}
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Status</div>
                                    <div class="detail-value" style="color: ${this.selectedAccountDetail.IsActive ? '#10b981' : '#ef4444'}">
                                        ${this.selectedAccountDetail.IsActive ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Overdraft Limit</div>
                                    <div class="detail-value">$${(this.selectedAccountDetail.Overdraft || 0).toLocaleString()}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Created Date</div>
                                    <div class="detail-value">${(this.selectedAccountDetail.CreatedOn || '').split('T')[0]}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Manager ID</div>
                                    <div class="detail-value">${this.selectedAccountDetail.Manager}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : nothing}
            `;
        }
    }

    if (!customElements.get('banking-overview-dashboard')) {
        customElements.define('banking-overview-dashboard', BankingOverviewDashboard);
    }
})();
