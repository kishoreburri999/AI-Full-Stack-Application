from django.db.models import Sum
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    Account,
    Alert,
    AuditEvent,
    Beneficiary,
    Client,
    Document,
    Goal,
    Meeting,
    Task,
    TaxOpportunity,
    Trade,
)

from .serializers import (
    AccountSerializer,
    AlertSerializer,
    AuditEventSerializer,
    BeneficiarySerializer,
    ClientSerializer,
    DocumentSerializer,
    GoalSerializer,
    MeetingSerializer,
    TaskSerializer,
    TaxOpportunitySerializer,
    TradeSerializer,
)


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all().order_by("-created_at")
    serializer_class = ClientSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(
                name__icontains=search
            )

        return queryset


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.select_related("client").all()
    serializer_class = AccountSerializer


class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.select_related("client").all()
    serializer_class = GoalSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.select_related("client").all().order_by(
        "due_date"
    )
    serializer_class = TaskSerializer


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.select_related("client").all().order_by(
        "meeting_date"
    )
    serializer_class = MeetingSerializer


class TradeViewSet(viewsets.ModelViewSet):
    queryset = Trade.objects.select_related("client").all().order_by(
        "-created_at"
    )
    serializer_class = TradeSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.select_related("client").all().order_by(
        "-uploaded_at"
    )
    serializer_class = DocumentSerializer


class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all().order_by("-created_at")
    serializer_class = AlertSerializer


class TaxOpportunityViewSet(viewsets.ModelViewSet):
    queryset = TaxOpportunity.objects.select_related("client").all()
    serializer_class = TaxOpportunitySerializer


class BeneficiaryViewSet(viewsets.ModelViewSet):
    queryset = Beneficiary.objects.select_related("client").all()
    serializer_class = BeneficiarySerializer


class AuditEventViewSet(viewsets.ModelViewSet):
    queryset = AuditEvent.objects.all().order_by("-created_at")
    serializer_class = AuditEventSerializer


@api_view(["GET"])
def dashboard(request):
    clients = Client.objects.all()

    total_clients = clients.count()

    total_assets = (
        Account.objects.aggregate(
            total=Sum("balance")
        )["total"]
        or 0
    )

    total_goals = Goal.objects.count()

    completed_tasks = Task.objects.filter(
        status="Completed"
    ).count()

    pending_tasks = Task.objects.exclude(
        status="Completed"
    ).count()

    pending_trades = Trade.objects.filter(
        status="Pending"
    ).count()

    unread_alerts = Alert.objects.filter(
        is_read=False
    ).count()

    tax_savings = (
        TaxOpportunity.objects.aggregate(
            total=Sum("estimated_savings")
        )["total"]
        or 0
    )

    recent_clients = Client.objects.all().order_by(
        "-created_at"
    )[:5]

    recent_tasks = Task.objects.select_related(
        "client"
    ).order_by("-created_at")[:5]

    return Response(
        {
            "metrics": {
                "total_clients": total_clients,
                "total_assets": float(total_assets),
                "total_goals": total_goals,
                "completed_tasks": completed_tasks,
                "pending_tasks": pending_tasks,
                "pending_trades": pending_trades,
                "unread_alerts": unread_alerts,
                "tax_savings": float(tax_savings),
            },
            "recent_clients": ClientSerializer(
                recent_clients,
                many=True,
            ).data,
            "recent_tasks": TaskSerializer(
                recent_tasks,
                many=True,
            ).data,
        }
    )


@api_view(["GET"])
def portfolio_summary(request):
    accounts = Account.objects.select_related("client")

    data = []

    for account in accounts:
        data.append(
            {
                "id": account.id,
                "client": account.client.name,
                "account": account.name,
                "type": account.account_type,
                "institution": account.institution,
                "balance": float(account.balance),
                "status": account.status,
            }
        )

    return Response(data)


@api_view(["GET"])
def advisor_summary(request):
    return Response(
        {
            "advisor": "Alex Morgan",
            "role": "Senior Wealth Advisor",
            "clients": Client.objects.filter(
                advisor="Alex Morgan"
            ).count(),
            "aum": float(
                Account.objects.aggregate(
                    total=Sum("balance")
                )["total"]
                or 0
            ),
            "open_tasks": Task.objects.exclude(
                status="Completed"
            ).count(),
            "pending_approvals": Trade.objects.filter(
                status="Pending"
            ).count(),
        }
    )


@api_view(["POST"])
def mark_alert_read(request, pk):
    try:
        alert = Alert.objects.get(pk=pk)
    except Alert.DoesNotExist:
        return Response(
            {"error": "Alert not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    alert.is_read = True
    alert.save()

    return Response(
        AlertSerializer(alert).data
    )