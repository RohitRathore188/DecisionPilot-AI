class ReportService:
    @staticmethod
    def generate_csv_report(metric_type: str) -> str:
        if metric_type == "weekly":
            return "Week,Revenue,Opex,StockAlerts\nWeek 1,₹35000,₹22000,0\nWeek 2,₹38000,₹24000,0\nWeek 3,₹42000,₹25000,2\nWeek 4,₹35000,₹24000,0"
        elif metric_type == "monthly":
            return "Scenario,Revenue,Cost,Profit,Risk\nExpansion,₹280000,₹160000,₹120000,High\nOptimization,₹160000,₹85000,₹75000,Low\nStaffing,₹310000,₹140000,₹170000,Medium"
        return "Metric,Value,Status\nMonthly Revenue,₹150000,Stable\nMonthly Opex,₹95000,Stable\nStock Optimization,92%,Healthy\nRisk Profile,Low,Safe"
