import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";


import {
  LayoutDashboard,
  Users,
  WalletCards,
  Target,
  CheckSquare,
  CalendarDays,
  ArrowLeftRight,
  FileText,
  Bell,
  ShieldCheck,
  Calculator,
  UserRound,
  Search,
  Plus,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  DollarSign,
  CircleAlert,
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";

import "./styles.css";


const API = "http://127.0.0.1:8000/api";


async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json();
}


function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [clients, setClients] = useState([]);
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [trades, setTrades] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showClientModal, setShowClientModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const loadData = async () => {
    setLoading(true);

    try {
      const [
        dashboardData,
        clientsData,
        goalsData,
        tasksData,
        tradesData,
        alertsData,
        portfolioData,
      ] = await Promise.all([
        apiRequest("/dashboard/"),
        apiRequest("/clients/"),
        apiRequest("/goals/"),
        apiRequest("/tasks/"),
        apiRequest("/trades/"),
        apiRequest("/alerts/"),
        apiRequest("/portfolio-summary/"),
      ]);

      setDashboard(dashboardData);
      setClients(clientsData);
      setGoals(goalsData);
      setTasks(tasksData);
      setTrades(tradesData);
      setAlerts(alertsData);
      setPortfolio(portfolioData);
    } catch (error) {
      console.error(error);
      alert(
        "Backend is not running. Start Django server first."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();
  }, []);


  const filteredClients = useMemo(() => {
    const query = search.toLowerCase();

    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query)
    );
  }, [clients, search]);


  const navigation = [
    {
      section: "OVERVIEW",
      items: [
        {
          name: "Dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "Clients",
          icon: Users,
        },
        {
          name: "Portfolio",
          icon: WalletCards,
        },
        {
          name: "Goals",
          icon: Target,
        },
      ],
    },
    {
      section: "WORKSPACE",
      items: [
        {
          name: "Tasks",
          icon: CheckSquare,
        },
        {
          name: "Meetings",
          icon: CalendarDays,
        },
        {
          name: "Trades",
          icon: ArrowLeftRight,
        },
        {
          name: "Documents",
          icon: FileText,
        },
      ],
    },
    {
      section: "PLANNING",
      items: [
        {
          name: "Tax Planning",
          icon: Calculator,
        },
        {
          name: "Beneficiaries",
          icon: UserRound,
        },
      ],
    },
    {
      section: "CONTROL",
      items: [
        {
          name: "Alerts",
          icon: Bell,
        },
        {
          name: "Compliance",
          icon: ShieldCheck,
        },
      ],
    },
  ];


  const handleNavigation = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };


  const createClient = async (formData) => {
    try {
      await apiRequest("/clients/", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          net_worth: Number(formData.net_worth || 0),
          annual_income: Number(formData.annual_income || 0),
        }),
      });

      setShowClientModal(false);
      await loadData();
    } catch (error) {
      alert("Unable to create client.");
    }
  };


  const createTask = async (formData) => {
    try {
      await apiRequest("/tasks/", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          client: formData.client
            ? Number(formData.client)
            : null,
        }),
      });

      setShowTaskModal(false);
      await loadData();
    } catch (error) {
      alert("Unable to create task.");
    }
  };


  const markAlertRead = async (id) => {
    try {
      await apiRequest(`/alerts/${id}/read/`, {
        method: "POST",
      });

      await loadData();
    } catch (error) {
      console.error(error);
    }
  };


  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-card">
          <div className="loading-logo">W</div>
          <h2>WealthAgent</h2>
          <p>Loading wealth management workspace...</p>
          <div className="loader"></div>
        </div>
      </div>
    );
  }


  return (
    <div className="app">

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="brand">
          <div className="brand-mark">W</div>

          <div>
            <strong>WealthAgent</strong>
            <span>Advisor Platform</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>


        <div className="advisor-mini">
          <div className="avatar avatar-purple">
            AM
          </div>

          <div>
            <strong>Alex Morgan</strong>
            <span>Senior Advisor</span>
          </div>

          <MoreHorizontal size={18} />
        </div>


        <nav>
          {navigation.map((group) => (
            <div
              className="nav-group"
              key={group.section}
            >
              <div className="nav-section">
                {group.section}
              </div>

              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.name}
                    className={`nav-item ${
                      activePage === item.name
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleNavigation(item.name)
                    }
                  >
                    <Icon size={18} />

                    <span>{item.name}</span>

                    {item.name === "Alerts" &&
                      alerts.filter(
                        (alert) => !alert.is_read
                      ).length > 0 && (
                        <b className="nav-badge">
                          {
                            alerts.filter(
                              (alert) =>
                                !alert.is_read
                            ).length
                          }
                        </b>
                      )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>


        <div className="sidebar-footer">
          <div className="security-status">
            <ShieldCheck size={17} />

            <div>
              <strong>System Secure</strong>
              <span>All systems operational</span>
            </div>
          </div>

          <small>
            WealthAgent v1.0
          </small>
        </div>
      </aside>


      <main className="main">

        <header className="topbar">

          <button
            className="mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={22} />
          </button>


          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={15} />
            <strong>{activePage}</strong>
          </div>


          <div className="topbar-actions">

            <div className="search-box">
              <Search size={17} />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search clients..."
              />
            </div>


            <button
              className="icon-button"
              onClick={loadData}
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>


            <button
              className="notification-button"
              onClick={() =>
                handleNavigation("Alerts")
              }
            >
              <Bell size={19} />

              {alerts.some(
                (alert) => !alert.is_read
              ) && (
                <span className="notification-dot"></span>
              )}
            </button>


            <div className="top-avatar">
              AM
            </div>

          </div>
        </header>


        <div className="content">

          {activePage === "Dashboard" && (
            <DashboardPage
              dashboard={dashboard}
              goals={goals}
              tasks={tasks}
              alerts={alerts}
              onAlertRead={markAlertRead}
              onNavigate={handleNavigation}
              onAddTask={() =>
                setShowTaskModal(true)
              }
            />
          )}


          {activePage === "Clients" && (
            <ClientsPage
              clients={filteredClients}
              onAdd={() =>
                setShowClientModal(true)
              }
            />
          )}


          {activePage === "Portfolio" && (
            <PortfolioPage
              portfolio={portfolio}
            />
          )}


          {activePage === "Goals" && (
            <GoalsPage goals={goals} />
          )}


          {activePage === "Tasks" && (
            <TasksPage
              tasks={tasks}
              clients={clients}
              onAdd={() =>
                setShowTaskModal(true)
              }
              onRefresh={loadData}
            />
          )}


          {activePage === "Meetings" && (
            <SimpleDataPage
              title="Meetings"
              subtitle="Upcoming client meetings and reviews"
              endpoint="/meetings/"
              columns={[
                "title",
                "client_name",
                "meeting_type",
                "meeting_date",
                "status",
              ]}
            />
          )}


          {activePage === "Trades" && (
            <TradesPage trades={trades} />
          )}


          {activePage === "Documents" && (
            <SimpleDataPage
              title="Document Vault"
              subtitle="Client documents and records"
              endpoint="/documents/"
              columns={[
                "name",
                "client_name",
                "document_type",
                "status",
              ]}
            />
          )}


          {activePage === "Tax Planning" && (
            <SimpleDataPage
              title="Tax Planning"
              subtitle="Tax optimization opportunities"
              endpoint="/tax-opportunities/"
              columns={[
                "title",
                "client_name",
                "estimated_savings",
                "status",
              ]}
            />
          )}


          {activePage === "Beneficiaries" && (
            <SimpleDataPage
              title="Beneficiaries"
              subtitle="Estate and beneficiary records"
              endpoint="/beneficiaries/"
              columns={[
                "name",
                "client_name",
                "relationship",
                "percentage",
                "verified",
              ]}
            />
          )}


          {activePage === "Alerts" && (
            <AlertsPage
              alerts={alerts}
              onRead={markAlertRead}
            />
          )}


          {activePage === "Compliance" && (
            <CompliancePage />
          )}

        </div>
      </main>


      {showClientModal && (
        <ClientModal
          onClose={() =>
            setShowClientModal(false)
          }
          onSubmit={createClient}
        />
      )}


      {showTaskModal && (
        <TaskModal
          clients={clients}
          onClose={() =>
            setShowTaskModal(false)
          }
          onSubmit={createTask}
        />
      )}

    </div>
  );
}


/* DASHBOARD */

function DashboardPage({
  dashboard,
  goals,
  tasks,
  alerts,
  onAlertRead,
  onNavigate,
  onAddTask,
}) {
  const metrics = dashboard?.metrics || {};

  return (
    <>

      <PageHeader
        title="Good morning, Alex"
        subtitle="Here's what's happening across your wealth management practice."
        action={
          <button
            className="primary-button"
            onClick={onAddTask}
          >
            <Plus size={18} />
            New Task
          </button>
        }
      />


      <div className="metrics-grid">

        <MetricCard
          icon={<Users />}
          title="Total Clients"
          value={metrics.total_clients}
          caption="+8.4% this quarter"
          trend="up"
        />

        <MetricCard
          icon={<DollarSign />}
          title="Assets Under Management"
          value={money(metrics.total_assets)}
          caption="+5.7% this month"
          trend="up"
        />

        <MetricCard
          icon={<Target />}
          title="Financial Goals"
          value={metrics.total_goals}
          caption="Across your client base"
        />

        <MetricCard
          icon={<CheckSquare />}
          title="Open Tasks"
          value={metrics.pending_tasks}
          caption={`${metrics.completed_tasks} completed`}
        />

      </div>


      <div className="dashboard-grid">

        <section className="panel portfolio-panel">

          <div className="panel-header">
            <div>
              <h2>Portfolio Overview</h2>
              <p>Assets under management</p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                onNavigate("Portfolio")
              }
            >
              View portfolio
              <ChevronRight size={16} />
            </button>
          </div>


          <div className="portfolio-chart">

            <div className="chart-center">
              <span>Total AUM</span>
              <strong>
                {money(metrics.total_assets)}
              </strong>
              <small>
                <TrendingUp size={13} />
                5.7% this month
              </small>
            </div>

            <div className="donut-chart">
              <div className="donut-inner"></div>
            </div>

          </div>


          <div className="allocation-list">
            <Allocation
              label="Equities"
              percentage="58%"
              amount="$1.74M"
            />

            <Allocation
              label="Fixed Income"
              percentage="22%"
              amount="$660K"
            />

            <Allocation
              label="Alternatives"
              percentage="12%"
              amount="$360K"
            />

            <Allocation
              label="Cash"
              percentage="8%"
              amount="$240K"
            />
          </div>

        </section>


        <section className="panel goals-panel">

          <div className="panel-header">
            <div>
              <h2>Goal Progress</h2>
              <p>Client financial goals</p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                onNavigate("Goals")
              }
            >
              View all
              <ChevronRight size={16} />
            </button>
          </div>


          <div className="goal-list">

            {goals.slice(0, 4).map((goal) => (
              <div
                className="goal-row"
                key={goal.id}
              >
                <div className="goal-icon">
                  <Target size={17} />
                </div>

                <div className="goal-info">
                  <div className="goal-title">
                    <strong>{goal.name}</strong>
                    <span>
                      {goal.progress}%
                    </span>
                  </div>

                  <div className="progress">
                    <div
                      style={{
                        width: `${goal.progress}%`,
                      }}
                    ></div>
                  </div>

                  <small>
                    {money(goal.current_amount)}
                    {" / "}
                    {money(goal.target_amount)}
                  </small>
                </div>
              </div>
            ))}

          </div>

        </section>

      </div>


      <div className="dashboard-grid lower">

        <section className="panel">

          <div className="panel-header">
            <div>
              <h2>Recent Tasks</h2>
              <p>Items requiring your attention</p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                onNavigate("Tasks")
              }
            >
              View all
              <ChevronRight size={16} />
            </button>
          </div>


          <div className="task-list">

            {tasks.slice(0, 5).map((task) => (
              <div
                className="task-row"
                key={task.id}
              >

                <div
                  className={`priority-dot ${task.priority.toLowerCase()}`}
                ></div>

                <div className="task-content">
                  <strong>{task.title}</strong>

                  <span>
                    {task.client_name ||
                      "Internal task"}
                  </span>
                </div>

                <div className="task-status">
                  {task.status}
                </div>

                <Clock3 size={16} />

              </div>
            ))}

          </div>

        </section>


        <section className="panel">

          <div className="panel-header">
            <div>
              <h2>Alerts</h2>
              <p>Items requiring review</p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                onNavigate("Alerts")
              }
            >
              View all
              <ChevronRight size={16} />
            </button>
          </div>


          <div className="alert-list">

            {alerts.slice(0, 4).map((alert) => (
              <div
                className={`alert-row ${alert.severity.toLowerCase()}`}
                key={alert.id}
                onClick={() =>
                  onAlertRead(alert.id)
                }
              >

                <div className="alert-icon">
                  {alert.severity ===
                  "Critical" ? (
                    <CircleAlert size={17} />
                  ) : (
                    <Bell size={17} />
                  )}
                </div>

                <div>
                  <strong>{alert.title}</strong>
                  <span>{alert.message}</span>
                </div>

              </div>
            ))}

          </div>

        </section>

      </div>

    </>
  );
}


/* CLIENTS */

function ClientsPage({ clients, onAdd }) {
  return (
    <>
      <PageHeader
        title="Clients"
        subtitle="Manage your client relationships and financial profiles."
        action={
          <button
            className="primary-button"
            onClick={onAdd}
          >
            <Plus size={18} />
            Add Client
          </button>
        }
      />

      <div className="client-stats">
        <MiniStat
          label="Total Clients"
          value={clients.length}
        />

        <MiniStat
          label="Active"
          value={
            clients.filter(
              (client) =>
                client.status === "Active"
            ).length
          }
        />

        <MiniStat
          label="Prospects"
          value={
            clients.filter(
              (client) =>
                client.status === "Prospect"
            ).length
          }
        />
      </div>


      <div className="panel table-panel">

        <div className="table-header">
          <div>
            <h2>Client Directory</h2>
            <p>
              {clients.length} clients
            </p>
          </div>
        </div>


        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>CLIENT</th>
                <th>STATUS</th>
                <th>RISK PROFILE</th>
                <th>NET WORTH</th>
                <th>LOCATION</th>
                <th>ADVISOR</th>
              </tr>
            </thead>

            <tbody>

              {clients.map((client) => (
                <tr key={client.id}>

                  <td>
                    <div className="client-cell">
                      <div className="avatar">
                        {initials(
                          client.name
                        )}
                      </div>

                      <div>
                        <strong>
                          {client.name}
                        </strong>

                        <span>
                          {client.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <StatusBadge
                      value={client.status}
                    />
                  </td>

                  <td>
                    {client.risk_profile}
                  </td>

                  <td className="money">
                    {money(client.net_worth)}
                  </td>

                  <td>
                    {client.location || "—"}
                  </td>

                  <td>
                    {client.advisor}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}


/* PORTFOLIO */

function PortfolioPage({ portfolio }) {
  const total = portfolio.reduce(
    (sum, item) =>
      sum + Number(item.balance || 0),
    0
  );

  return (
    <>
      <PageHeader
        title="Portfolio"
        subtitle="Monitor accounts, balances and connected institutions."
      />

      <div className="metrics-grid">

        <MetricCard
          icon={<WalletCards />}
          title="Total AUM"
          value={money(total)}
          caption="Across all connected accounts"
        />

        <MetricCard
          icon={<TrendingUp />}
          title="Connected Accounts"
          value={portfolio.length}
          caption="Live account connections"
        />

        <MetricCard
          icon={<ShieldCheck />}
          title="Healthy Connections"
          value={
            portfolio.filter(
              (x) => x.status === "Connected"
            ).length
          }
          caption="No sync issues"
        />

      </div>


      <div className="panel table-panel">

        <div className="table-header">
          <div>
            <h2>Investment Accounts</h2>
            <p>
              Account-level portfolio information
            </p>
          </div>
        </div>


        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>ACCOUNT</th>
                <th>CLIENT</th>
                <th>TYPE</th>
                <th>INSTITUTION</th>
                <th>BALANCE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>

              {portfolio.map((item) => (
                <tr key={item.id}>

                  <td>
                    <strong>
                      {item.account}
                    </strong>
                  </td>

                  <td>
                    {item.client}
                  </td>

                  <td>
                    {item.type}
                  </td>

                  <td>
                    {item.institution}
                  </td>

                  <td className="money">
                    {money(item.balance)}
                  </td>

                  <td>
                    <StatusBadge
                      value={item.status}
                    />
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}


/* GOALS */

function GoalsPage({ goals }) {
  return (
    <>
      <PageHeader
        title="Financial Goals"
        subtitle="Track client progress toward their most important financial objectives."
      />

      <div className="goals-card-grid">

        {goals.map((goal) => (
          <div
            className="goal-card"
            key={goal.id}
          >

            <div className="goal-card-top">

              <div className="goal-icon large">
                <Target size={21} />
              </div>

              <StatusBadge
                value={`${goal.progress}%`}
              />

            </div>

            <h3>{goal.name}</h3>

            <p>
              {goal.client_name}
            </p>

            <div className="large-progress">
              <div
                style={{
                  width: `${goal.progress}%`,
                }}
              ></div>
            </div>

            <div className="goal-values">

              <div>
                <span>Current</span>
                <strong>
                  {money(
                    goal.current_amount
                  )}
                </strong>
              </div>

              <div>
                <span>Target</span>
                <strong>
                  {money(
                    goal.target_amount
                  )}
                </strong>
              </div>

            </div>

          </div>
        ))}

      </div>
    </>
  );
}


/* TASKS */

function TasksPage({
  tasks,
  clients,
  onAdd,
  onRefresh,
}) {
  return (
    <>
      <PageHeader
        title="Tasks"
        subtitle="Stay on top of advisor actions and client requests."
        action={
          <button
            className="primary-button"
            onClick={onAdd}
          >
            <Plus size={18} />
            New Task
          </button>
        }
      />

      <div className="panel table-panel">

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>TASK</th>
                <th>CLIENT</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th>DUE DATE</th>
                <th>OWNER</th>
              </tr>
            </thead>

            <tbody>

              {tasks.map((task) => (
                <tr key={task.id}>

                  <td>
                    <strong>
                      {task.title}
                    </strong>

                    <span className="table-description">
                      {task.description}
                    </span>
                  </td>

                  <td>
                    {task.client_name ||
                      "Internal"}
                  </td>

                  <td>
                    <PriorityBadge
                      value={task.priority}
                    />
                  </td>

                  <td>
                    <StatusBadge
                      value={task.status}
                    />
                  </td>

                  <td>
                    {task.due_date || "—"}
                  </td>

                  <td>
                    {task.owner}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}


/* TRADES */

function TradesPage({ trades }) {
  return (
    <>
      <PageHeader
        title="Trades"
        subtitle="Review and monitor portfolio trade activity."
      />

      <div className="metrics-grid">

        <MetricCard
          icon={<ArrowLeftRight />}
          title="Pending Trades"
          value={
            trades.filter(
              (trade) =>
                trade.status === "Pending"
            ).length
          }
          caption="Awaiting approval"
        />

        <MetricCard
          icon={<CheckCircle2 />}
          title="Approved"
          value={
            trades.filter(
              (trade) =>
                trade.status === "Approved"
            ).length
          }
          caption="Ready for execution"
        />

        <MetricCard
          icon={<DollarSign />}
          title="Trade Volume"
          value={money(
            trades.reduce(
              (sum, trade) =>
                sum +
                Number(
                  trade.total_value || 0
                ),
              0
            )
          )}
          caption="Current trade value"
        />

      </div>


      <div className="panel table-panel">

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>CLIENT</th>
                <th>SYMBOL</th>
                <th>ASSET</th>
                <th>ACTION</th>
                <th>QUANTITY</th>
                <th>PRICE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>

              {trades.map((trade) => (
                <tr key={trade.id}>

                  <td>
                    {trade.client_name}
                  </td>

                  <td>
                    <strong>
                      {trade.symbol}
                    </strong>
                  </td>

                  <td>
                    {trade.asset_name}
                  </td>

                  <td>
                    <span
                      className={`trade-action ${trade.action.toLowerCase()}`}
                    >
                      {trade.action}
                    </span>
                  </td>

                  <td>
                    {trade.quantity}
                  </td>

                  <td>
                    {money(trade.price)}
                  </td>

                  <td>
                    <StatusBadge
                      value={trade.status}
                    />
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}


/* ALERTS */

function AlertsPage({
  alerts,
  onRead,
}) {
  return (
    <>
      <PageHeader
        title="Alerts"
        subtitle="Review notifications, compliance events and portfolio warnings."
      />

      <div className="alert-grid">

        {alerts.map((alert) => (
          <div
            className={`full-alert ${
              alert.severity.toLowerCase()
            } ${
              alert.is_read
                ? "read"
                : ""
            }`}
            key={alert.id}
          >

            <div className="full-alert-icon">
              <Bell size={20} />
            </div>

            <div className="full-alert-content">

              <div className="alert-title-row">
                <h3>
                  {alert.title}
                </h3>

                <PriorityBadge
                  value={alert.severity}
                />
              </div>

              <p>
                {alert.message}
              </p>

              {!alert.is_read && (
                <button
                  className="secondary-button"
                  onClick={() =>
                    onRead(alert.id)
                  }
                >
                  Mark as read
                </button>
              )}

            </div>

          </div>
        ))}

      </div>
    </>
  );
}


/* COMPLIANCE */

function CompliancePage() {
  const controls = [
    [
      "KYC / AML Monitoring",
      "All active clients reviewed",
      "Healthy",
    ],
    [
      "Trade Approval",
      "Approval workflow operational",
      "Healthy",
    ],
    [
      "Document Retention",
      "Retention policies configured",
      "Healthy",
    ],
    [
      "Audit Trail",
      "All advisor actions recorded",
      "Healthy",
    ],
    [
      "Data Synchronization",
      "Connected institutions monitored",
      "Healthy",
    ],
  ];

  return (
    <>
      <PageHeader
        title="Compliance Center"
        subtitle="Monitor operational controls, audit activity and regulatory readiness."
      />

      <div className="compliance-grid">

        {controls.map(
          ([title, description, status]) => (
            <div
              className="compliance-card"
              key={title}
            >

              <div className="compliance-icon">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h3>{title}</h3>
                <p>{description}</p>

                <span className="healthy">
                  <CheckCircle2 size={14} />
                  {status}
                </span>
              </div>

            </div>
          )
        )}

      </div>


      <div className="panel audit-panel">

        <div className="panel-header">

          <div>
            <h2>Control Framework</h2>
            <p>
              Operational governance overview
            </p>
          </div>

          <span className="secure-pill">
            <ShieldCheck size={14} />
            Secure
          </span>

        </div>


        <div className="framework">

          <div>
            <span>Identity & Access</span>
            <strong>RBAC enabled</strong>
          </div>

          <div>
            <span>Encryption</span>
            <strong>Protected</strong>
          </div>

          <div>
            <span>Audit Logging</span>
            <strong>Enabled</strong>
          </div>

          <div>
            <span>Data Backup</span>
            <strong>Automated</strong>
          </div>

        </div>

      </div>
    </>
  );
}


/* GENERIC DATA PAGE */

function SimpleDataPage({
  title,
  subtitle,
  endpoint,
  columns,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const result = await apiRequest(endpoint);
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [endpoint]);

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
      />

      <div className="panel table-panel">

        {loading ? (
          <div className="empty-state">
            Loading...
          </div>
        ) : (
          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column}>
                      {column
                        .replaceAll("_", " ")
                        .toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>

                {data.map((item) => (
                  <tr key={item.id}>

                    {columns.map((column) => (
                      <td key={column}>

                        {column ===
                        "estimated_savings" ? (
                          money(
                            item[column]
                          )
                        ) : column ===
                          "verified" ? (
                          item[column] ? (
                            <span className="verified">
                              <CheckCircle2
                                size={15}
                              />
                              Verified
                            </span>
                          ) : (
                            <span className="not-verified">
                              Pending
                            </span>
                          )
                        ) : (
                          item[column] ??
                          "—"
                        )}

                      </td>
                    ))}

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </>
  );
}


/* MODAL - CLIENT */

function ClientModal({
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
    risk_profile: "Moderate",
    net_worth: "",
    annual_income: "",
    location: "",
    advisor: "Alex Morgan",
  });


  const update = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };


  const submit = (event) => {
    event.preventDefault();

    if (!form.name || !form.email) {
      alert("Name and email are required.");
      return;
    }

    onSubmit(form);
  };


  return (
    <Modal
      title="Add New Client"
      onClose={onClose}
    >

      <form
        className="form-grid"
        onSubmit={submit}
      >

        <FormField
          label="Full Name"
          value={form.name}
          onChange={(value) =>
            update("name", value)
          }
          required
        />

        <FormField
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) =>
            update("email", value)
          }
          required
        />

        <FormField
          label="Phone"
          value={form.phone}
          onChange={(value) =>
            update("phone", value)
          }
        />

        <FormField
          label="Location"
          value={form.location}
          onChange={(value) =>
            update("location", value)
          }
        />

        <FormSelect
          label="Risk Profile"
          value={form.risk_profile}
          options={[
            "Conservative",
            "Moderate",
            "Growth",
            "Aggressive",
          ]}
          onChange={(value) =>
            update("risk_profile", value)
          }
        />

        <FormField
          label="Net Worth"
          type="number"
          value={form.net_worth}
          onChange={(value) =>
            update("net_worth", value)
          }
        />

        <FormField
          label="Annual Income"
          type="number"
          value={form.annual_income}
          onChange={(value) =>
            update("annual_income", value)
          }
        />

        <div className="modal-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            Create Client
          </button>

        </div>

      </form>

    </Modal>
  );
}


/* MODAL - TASK */

function TaskModal({
  clients,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    client: "",
    priority: "Medium",
    status: "Open",
    due_date: "",
    owner: "Alex Morgan",
  });


  const update = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };


  const submit = (event) => {
    event.preventDefault();

    if (!form.title) {
      alert("Task title is required.");
      return;
    }

    onSubmit(form);
  };


  return (
    <Modal
      title="Create Task"
      onClose={onClose}
    >

      <form
        className="form-grid"
        onSubmit={submit}
      >

        <FormField
          label="Task Title"
          value={form.title}
          onChange={(value) =>
            update("title", value)
          }
          required
        />

        <FormField
          label="Description"
          value={form.description}
          onChange={(value) =>
            update(
              "description",
              value
            )
          }
        />

        <FormSelect
          label="Client"
          value={form.client}
          options={[
            "",
            ...clients.map(
              (client) =>
                `${client.id}|${client.name}`
            ),
          ]}
          displayOptions={[
            "No client",
            ...clients.map(
              (client) =>
                client.name
            ),
          ]}
          onChange={(value) =>
            update("client", value)
          }
        />

        <FormSelect
          label="Priority"
          value={form.priority}
          options={[
            "Low",
            "Medium",
            "High",
            "Critical",
          ]}
          onChange={(value) =>
            update(
              "priority",
              value
            )
          }
        />

        <FormSelect
          label="Status"
          value={form.status}
          options={[
            "Open",
            "In Progress",
            "Completed",
          ]}
          onChange={(value) =>
            update("status", value)
          }
        />

        <FormField
          label="Due Date"
          type="date"
          value={form.due_date}
          onChange={(value) =>
            update(
              "due_date",
              value
            )
          }
        />

        <div className="modal-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            Create Task
          </button>

        </div>

      </form>

    </Modal>
  );
}


/* COMPONENTS */

function PageHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <div className="page-header">

      <div>
        <div className="eyebrow">
          WEALTH MANAGEMENT
        </div>

        <h1>{title}</h1>

        <p>{subtitle}</p>
      </div>

      {action}

    </div>
  );
}


function MetricCard({
  icon,
  title,
  value,
  caption,
  trend,
}) {
  return (
    <div className="metric-card">

      <div className="metric-top">

        <div className="metric-icon">
          {icon}
        </div>

        {trend && (
          <span className="trend">
            <TrendingUp size={13} />
            Up
          </span>
        )}

      </div>

      <span className="metric-title">
        {title}
      </span>

      <strong className="metric-value">
        {value}
      </strong>

      <span className="metric-caption">
        {caption}
      </span>

    </div>
  );
}


function MiniStat({
  label,
  value,
}) {
  return (
    <div className="mini-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}


function Allocation({
  label,
  percentage,
  amount,
}) {
  return (
    <div className="allocation-row">

      <div>
        <span className="allocation-dot"></span>
        {label}
      </div>

      <strong>{percentage}</strong>

      <span>{amount}</span>

    </div>
  );
}


function StatusBadge({ value }) {
  const className = String(value)
    .toLowerCase()
    .replaceAll(" ", "-");

  return (
    <span
      className={`status-badge ${className}`}
    >
      {value}
    </span>
  );
}


function PriorityBadge({ value }) {
  const className = String(value)
    .toLowerCase();

  return (
    <span
      className={`priority-badge ${className}`}
    >
      {value}
    </span>
  );
}


function Modal({
  title,
  children,
  onClose,
}) {
  return (
    <div className="modal-backdrop">

      <div className="modal">

        <div className="modal-header">

          <div>
            <h2>{title}</h2>
            <p>
              Enter the required information below.
            </p>
          </div>

          <button
            className="icon-button"
            onClick={onClose}
          >
            <X size={19} />
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}


function FormField({
  label,
  type = "text",
  value,
  onChange,
  required = false,
}) {
  return (
    <label className="form-field">

      <span>{label}</span>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

    </label>
  );
}


function FormSelect({
  label,
  value,
  options,
  displayOptions,
  onChange,
}) {
  return (
    <label className="form-field">

      <span>{label}</span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >

        {options.map(
          (option, index) => {
            const display =
              displayOptions?.[index] ??
              option;

            const actualValue =
              option.includes("|")
                ? option.split("|")[0]
                : option;

            return (
              <option
                key={option}
                value={actualValue}
              >
                {display}
              </option>
            );
          }
        )}

      </select>

    </label>
  );
}


function money(value) {
  const number = Number(value || 0);

  if (number >= 1000000) {
    return `$${(
      number / 1000000
    ).toFixed(2)}M`;
  }

  if (number >= 1000) {
    return `$${(
      number / 1000
    ).toFixed(1)}K`;
  }

  return `$${number.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 0,
    }
  )}`;
}


function initials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}


createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);