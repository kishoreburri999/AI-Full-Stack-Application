from rest_framework import serializers

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


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"


class AccountSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(
        source="client.name",
        read_only=True,
    )

    class Meta:
        model = Account
        fields = "__all__"


class GoalSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(
        source="client.name",
        read_only=True,
    )
    progress = serializers.ReadOnlyField()

    class Meta:
        model = Goal
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(
        source="client.name",
        read_only=True,
    )

    class Meta:
        model = Task
        fields = "__all__"


class MeetingSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(
        source="client.name",
        read_only=True,
    )

    class Meta:
        model = Meeting
        fields = "__all__"


class TradeSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(
        source="client.name",
        read_only=True,
    )
    total_value = serializers.ReadOnlyField()

    class Meta:
        model = Trade
        fields = "__all__"


class DocumentSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(
        source="client.name",
        read_only=True,
    )

    class Meta:
        model = Document
        fields = "__all__"


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = "__all__"


class TaxOpportunitySerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(
        source="client.name",
        read_only=True,
    )

    class Meta:
        model = TaxOpportunity
        fields = "__all__"


class BeneficiarySerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(
        source="client.name",
        read_only=True,
    )

    class Meta:
        model = Beneficiary
        fields = "__all__"


class AuditEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditEvent
        fields = "__all__"