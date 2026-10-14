from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AccountViewSet,
    AlertViewSet,
    AuditEventViewSet,
    BeneficiaryViewSet,
    ClientViewSet,
    DocumentViewSet,
    GoalViewSet,
    MeetingViewSet,
    TaskViewSet,
    TaxOpportunityViewSet,
    TradeViewSet,
    advisor_summary,
    dashboard,
    mark_alert_read,
    portfolio_summary,
)

router = DefaultRouter()

router.register("clients", ClientViewSet)
router.register("accounts", AccountViewSet)
router.register("goals", GoalViewSet)
router.register("tasks", TaskViewSet)
router.register("meetings", MeetingViewSet)
router.register("trades", TradeViewSet)
router.register("documents", DocumentViewSet)
router.register("alerts", AlertViewSet)
router.register("tax-opportunities", TaxOpportunityViewSet)
router.register("beneficiaries", BeneficiaryViewSet)
router.register("audit-events", AuditEventViewSet)


urlpatterns = [
    path(
        "dashboard/",
        dashboard,
        name="dashboard",
    ),
    path(
        "portfolio-summary/",
        portfolio_summary,
        name="portfolio-summary",
    ),
    path(
        "advisor-summary/",
        advisor_summary,
        name="advisor-summary",
    ),
    path(
        "alerts/<int:pk>/read/",
        mark_alert_read,
        name="mark-alert-read",
    ),
    path(
        "",
        include(router.urls),
    ),
]