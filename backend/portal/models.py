from django.db import models


class Client(models.Model):
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Prospect", "Prospect"),
        ("Inactive", "Inactive"),
    ]

    RISK_CHOICES = [
        ("Conservative", "Conservative"),
        ("Moderate", "Moderate"),
        ("Growth", "Growth"),
        ("Aggressive", "Aggressive"),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Active",
    )
    risk_profile = models.CharField(
        max_length=30,
        choices=RISK_CHOICES,
        default="Moderate",
    )
    net_worth = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
    )
    annual_income = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
    )
    location = models.CharField(max_length=100, blank=True)
    advisor = models.CharField(max_length=100, default="Alex Morgan")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Account(models.Model):
    ACCOUNT_TYPES = [
        ("Brokerage", "Brokerage"),
        ("Retirement", "Retirement"),
        ("IRA", "IRA"),
        ("401k", "401k"),
        ("Cash", "Cash"),
        ("Education", "Education"),
    ]

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="accounts",
    )
    name = models.CharField(max_length=150)
    account_type = models.CharField(
        max_length=50,
        choices=ACCOUNT_TYPES,
    )
    balance = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
    )
    institution = models.CharField(max_length=150)
    status = models.CharField(max_length=50, default="Connected")
    last_sync = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Goal(models.Model):
    GOAL_TYPES = [
        ("Retirement", "Retirement"),
        ("Education", "Education"),
        ("Home", "Home"),
        ("Emergency", "Emergency"),
        ("Travel", "Travel"),
        ("Legacy", "Legacy"),
    ]

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="goals",
    )
    name = models.CharField(max_length=150)
    goal_type = models.CharField(
        max_length=50,
        choices=GOAL_TYPES,
    )
    target_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
    )
    current_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
    )
    target_date = models.DateField(null=True, blank=True)

    @property
    def progress(self):
        if not self.target_amount:
            return 0

        value = (
            float(self.current_amount)
            / float(self.target_amount)
        ) * 100

        return min(round(value, 1), 100)

    def __str__(self):
        return self.name


class Task(models.Model):
    PRIORITIES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
        ("Critical", "Critical"),
    ]

    STATUS = [
        ("Open", "Open"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    client = models.ForeignKey(
        Client,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tasks",
    )
    priority = models.CharField(
        max_length=30,
        choices=PRIORITIES,
        default="Medium",
    )
    status = models.CharField(
        max_length=30,
        choices=STATUS,
        default="Open",
    )
    due_date = models.DateField(null=True, blank=True)
    owner = models.CharField(max_length=100, default="Advisor")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Meeting(models.Model):
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="meetings",
    )
    title = models.CharField(max_length=200)
    meeting_date = models.DateTimeField()
    meeting_type = models.CharField(
        max_length=50,
        default="Review",
    )
    status = models.CharField(
        max_length=30,
        default="Scheduled",
    )

    def __str__(self):
        return self.title


class Trade(models.Model):
    ACTIONS = [
        ("BUY", "BUY"),
        ("SELL", "SELL"),
    ]

    STATUS = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Executed", "Executed"),
        ("Rejected", "Rejected"),
    ]

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="trades",
    )
    symbol = models.CharField(max_length=20)
    asset_name = models.CharField(max_length=150)
    action = models.CharField(
        max_length=10,
        choices=ACTIONS,
    )
    quantity = models.DecimalField(
        max_digits=15,
        decimal_places=4,
    )
    price = models.DecimalField(
        max_digits=15,
        decimal_places=2,
    )
    status = models.CharField(
        max_length=30,
        choices=STATUS,
        default="Pending",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total_value(self):
        return float(self.quantity) * float(self.price)

    def __str__(self):
        return f"{self.action} {self.symbol}"


class Document(models.Model):
    DOCUMENT_TYPES = [
        ("Statement", "Statement"),
        ("Tax", "Tax"),
        ("KYC", "KYC"),
        ("Agreement", "Agreement"),
        ("Report", "Report"),
    ]

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="documents",
    )
    name = models.CharField(max_length=200)
    document_type = models.CharField(
        max_length=50,
        choices=DOCUMENT_TYPES,
    )
    status = models.CharField(
        max_length=30,
        default="Available",
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Alert(models.Model):
    SEVERITY = [
        ("Info", "Info"),
        ("Warning", "Warning"),
        ("Critical", "Critical"),
    ]

    title = models.CharField(max_length=200)
    message = models.TextField()
    severity = models.CharField(
        max_length=30,
        choices=SEVERITY,
        default="Info",
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class TaxOpportunity(models.Model):
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="tax_opportunities",
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    estimated_savings = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
    )
    status = models.CharField(
        max_length=50,
        default="Available",
    )

    def __str__(self):
        return self.title


class Beneficiary(models.Model):
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="beneficiaries",
    )
    name = models.CharField(max_length=150)
    relationship = models.CharField(max_length=100)
    percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
    )
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class AuditEvent(models.Model):
    event_type = models.CharField(max_length=100)
    description = models.TextField()
    user = models.CharField(max_length=100, default="System")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.event_type