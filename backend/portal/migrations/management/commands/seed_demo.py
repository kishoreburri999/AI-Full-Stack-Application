from datetime import date, timedelta

from django.core.management.base import BaseCommand

from portal.models import (
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


class Command(BaseCommand):
    help = "Create demo data for the WealthAgent application"

    def handle(self, *args, **kwargs):

        if Client.objects.exists():
            self.stdout.write(
                self.style.WARNING(
                    "Demo data already exists."
                )
            )
            return

        client1 = Client.objects.create(
            name="James Wilson",
            email="james.wilson@example.com",
            phone="+1 415 555 0101",
            status="Active",
            risk_profile="Growth",
            net_worth=1850000,
            annual_income=280000,
            location="San Francisco",
            advisor="Alex Morgan",
        )

        client2 = Client.objects.create(
            name="Sarah Johnson",
            email="sarah.johnson@example.com",
            phone="+1 212 555 0198",
            status="Active",
            risk_profile="Moderate",
            net_worth=920000,
            annual_income=175000,
            location="New York",
            advisor="Alex Morgan",
        )

        client3 = Client.objects.create(
            name="Michael Chen",
            email="michael.chen@example.com",
            phone="+1 206 555 0144",
            status="Prospect",
            risk_profile="Conservative",
            net_worth=650000,
            annual_income=140000,
            location="Seattle",
            advisor="Alex Morgan",
        )

        Account.objects.create(
            client=client1,
            name="Growth Brokerage",
            account_type="Brokerage",
            balance=850000,
            institution="Fidelity",
        )

        Account.objects.create(
            client=client1,
            name="401(k)",
            account_type="401k",
            balance=520000,
            institution="Vanguard",
        )

        Account.objects.create(
            client=client1,
            name="Cash Reserve",
            account_type="Cash",
            balance=95000,
            institution="Chase",
        )

        Account.objects.create(
            client=client2,
            name="Managed Portfolio",
            account_type="Brokerage",
            balance=490000,
            institution="Charles Schwab",
        )

        Account.objects.create(
            client=client2,
            name="Traditional IRA",
            account_type="IRA",
            balance=270000,
            institution="Fidelity",
        )

        Account.objects.create(
            client=client2,
            name="Emergency Cash",
            account_type="Cash",
            balance=75000,
            institution="Bank of America",
        )

        Account.objects.create(
            client=client3,
            name="Conservative Portfolio",
            account_type="Brokerage",
            balance=380000,
            institution="Vanguard",
        )

        Goal.objects.create(
            client=client1,
            name="Retirement at 60",
            goal_type="Retirement",
            target_amount=3000000,
            current_amount=1450000,
            target_date=date(2045, 1, 1),
        )

        Goal.objects.create(
            client=client1,
            name="College Fund",
            goal_type="Education",
            target_amount=350000,
            current_amount=215000,
            target_date=date(2035, 6, 1),
        )

        Goal.objects.create(
            client=client2,
            name="Early Retirement",
            goal_type="Retirement",
            target_amount=2000000,
            current_amount=860000,
            target_date=date(2040, 1, 1),
        )

        Task.objects.create(
            title="Review portfolio allocation",
            description="Review equity allocation and rebalance if required.",
            client=client1,
            priority="High",
            status="In Progress",
            due_date=date.today() + timedelta(days=2),
            owner="Alex Morgan",
        )

        Task.objects.create(
            title="Collect updated KYC documents",
            description="Request updated identification documents.",
            client=client2,
            priority="Medium",
            status="Open",
            due_date=date.today() + timedelta(days=5),
            owner="Alex Morgan",
        )

        Task.objects.create(
            title="Prepare retirement projection",
            description="Prepare updated retirement income projection.",
            client=client3,
            priority="High",
            status="Open",
            due_date=date.today() + timedelta(days=7),
            owner="Alex Morgan",
        )

        Meeting.objects.create(
            client=client1,
            title="Annual Wealth Review",
            meeting_date="2026-10-02T10:00:00",
            meeting_type="Portfolio Review",
        )

        Meeting.objects.create(
            client=client2,
            title="Retirement Planning",
            meeting_date="2026-10-04T14:30:00",
            meeting_type="Planning",
        )

        Trade.objects.create(
            client=client1,
            symbol="VTI",
            asset_name="Vanguard Total Stock Market ETF",
            action="BUY",
            quantity=50,
            price=295,
            status="Pending",
        )

        Trade.objects.create(
            client=client2,
            symbol="BND",
            asset_name="Vanguard Total Bond Market ETF",
            action="SELL",
            quantity=30,
            price=73,
            status="Approved",
        )

        Document.objects.create(
            client=client1,
            name="2025 Annual Investment Statement",
            document_type="Statement",
        )

        Document.objects.create(
            client=client1,
            name="2025 Tax Summary",
            document_type="Tax",
        )

        Document.objects.create(
            client=client2,
            name="Client Agreement",
            document_type="Agreement",
        )

        Alert.objects.create(
            title="Portfolio drift detected",
            message="James Wilson portfolio is outside the target allocation range.",
            severity="Warning",
        )

        Alert.objects.create(
            title="KYC renewal required",
            message="Sarah Johnson requires updated KYC information.",
            severity="Critical",
        )

        Alert.objects.create(
            title="Account synchronization completed",
            message="All connected account balances were successfully synchronized.",
            severity="Info",
        )

        TaxOpportunity.objects.create(
            client=client1,
            title="Tax-loss harvesting opportunity",
            description="Potential harvesting opportunity identified in taxable portfolio.",
            estimated_savings=18500,
        )

        TaxOpportunity.objects.create(
            client=client2,
            title="IRA contribution opportunity",
            description="Additional retirement contribution may provide tax benefits.",
            estimated_savings=7200,
        )

        Beneficiary.objects.create(
            client=client1,
            name="Emily Wilson",
            relationship="Spouse",
            percentage=70,
            verified=True,
        )

        Beneficiary.objects.create(
            client=client1,
            name="Daniel Wilson",
            relationship="Child",
            percentage=30,
            verified=False,
        )

        AuditEvent.objects.create(
            event_type="Portfolio Review",
            description="Portfolio allocation reviewed by advisor.",
            user="Alex Morgan",
        )

        AuditEvent.objects.create(
            event_type="Trade Approval",
            description="Trade approval workflow initiated.",
            user="Alex Morgan",
        )

        AuditEvent.objects.create(
            event_type="Document Upload",
            description="Client tax document uploaded.",
            user="System",
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Demo data created successfully."
            )
        )