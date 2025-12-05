# Cost Impact Analysis in AI Scenarios

## Overview
Enhanced the AI Scenarios section with detailed cost impact analysis for each what-if situation, providing financial visibility for decision-making.

## Cost Breakdowns Added

### 1. Weather Delay Risk - Cost Impact
**Total Potential Cost: ₹4.40 Cr**

**Breakdown**:
- **Vessel Demurrage** (3 days @ ₹45L/day): ₹1.35 Cr
- **Port Waiting Charges**: ₹0.25 Cr
- **Plant Production Loss** (3 days): ₹2.80 Cr

**Mitigation Strategy**:
- Consider rerouting via southern route
- Additional cost: +₹0.8 Cr
- Net benefit: Avoids cyclone and ₹3.6 Cr in losses

**Visual Design**:
- Yellow background box
- Line-by-line cost breakdown
- Bold total with border separator
- Mitigation suggestion with 💡 icon

---

### 2. Port Congestion Alert - Cost Impact
**Total Potential Cost: ₹6.30 Cr**

**Breakdown**:
- **Demurrage** (5 days @ ₹45L/day): ₹2.25 Cr
- **Port Anchorage Charges**: ₹0.40 Cr
- **Crew Overtime & Provisions**: ₹0.15 Cr
- **Plant Stock-out Risk**: ₹3.50 Cr

**Mitigation Strategy**:
- Divert to Paradip Port
- Diversion cost: ₹2.5 Cr
- Net savings: ₹3.8 Cr after diversion costs

**Visual Design**:
- Orange background box
- Detailed cost components
- Emphasizes stock-out risk (highest cost)
- Clear mitigation recommendation

---

### 3. Alternative Route Suggestion - Cost Comparison
**Net Savings: ₹2.0 Cr**

**Current Route (VIZAG)**:
- Ocean Freight: ₹8.5 Cr
- Port Charges: ₹1.2 Cr
- Rail Freight: ₹3.8 Cr
- Demurrage Risk: ₹2.0 Cr
- **Total: ₹15.5 Cr** (shown in red)

**Alternative Route (Paradip)**:
- Ocean Freight: ₹8.8 Cr (+₹0.3 Cr)
- Port Charges: ₹0.9 Cr (-₹0.3 Cr)
- Rail Freight: ₹3.3 Cr (-₹0.5 Cr)
- Demurrage Risk: ₹0.5 Cr (-₹1.5 Cr)
- **Total: ₹13.5 Cr** (shown in green)

**Visual Design**:
- Green background box
- Side-by-side comparison (2 columns)
- Color-coded totals (red vs green)
- Large bold net savings display
- ✅ Recommendation badge

---

### 4. Rail Capacity Confirmed - Cost Breakdown
**Total Rail Cost: ₹[Dynamic] Cr**

**Calculation**:
```typescript
Rakes Required = Math.ceil(quantity_t / 3500)
Distance = ~850 km (port to plant)
Rail Freight = quantity_t × 850 × ₹0.95/km/tonne
```

**Breakdown**:
- **Rakes Required**: [Dynamic based on quantity]
- **Distance**: ~850 km
- **Rail Freight** (@ ₹0.95/km/tonne): [Calculated]
- **Loading/Unloading Charges**: ₹0.45 Cr
- **Transit Insurance**: ₹0.15 Cr

**Visual Design**:
- Blue background box
- Dynamic calculations based on actual schedule data
- Shows formula transparency
- Confirms no additional costs

---

## Financial Metrics

### Cost Categories Tracked

1. **Demurrage Costs**
   - Standard rate: ₹45 lakh per day
   - Major cost driver in delays
   - Calculated per scenario

2. **Port Charges**
   - Anchorage fees
   - Berth charges
   - Waiting time costs

3. **Rail Freight**
   - Distance-based calculation
   - Rate: ₹0.95 per km per tonne
   - Loading/unloading included

4. **Production Loss**
   - Plant downtime costs
   - Stock-out penalties
   - Opportunity costs

5. **Operational Costs**
   - Crew overtime
   - Provisions
   - Insurance

### Cost Comparison Framework

**Decision Matrix**:
```
Current Route Cost - Alternative Route Cost = Net Savings/Loss

If Net Savings > 0:
  → Recommend alternative
  → Show green badge
  
If Net Savings < 0:
  → Keep current route
  → Show cost justification
```

## Visual Design System

### Color Coding
- **Yellow Box**: Warning costs (weather, delays)
- **Orange Box**: High-impact costs (congestion)
- **Green Box**: Savings opportunities (alternatives)
- **Blue Box**: Confirmed costs (rail transport)

### Typography
- **Cost Labels**: text-muted-foreground (gray)
- **Cost Values**: font-semibold (bold)
- **Totals**: font-bold with border separator
- **Savings**: text-lg (larger) in green

### Layout
```
┌─────────────────────────────────────┐
│ Scenario Title                      │
│ Description                         │
│ Risk Badge + Impact                 │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Cost Impact Analysis:       │   │
│ │                             │   │
│ │ Line Item 1:        ₹X.XX Cr│   │
│ │ Line Item 2:        ₹X.XX Cr│   │
│ │ Line Item 3:        ₹X.XX Cr│   │
│ │ ─────────────────────────── │   │
│ │ Total:              ₹X.XX Cr│   │
│ │                             │   │
│ │ 💡 Mitigation: ...          │   │
│ └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## Dynamic Calculations

### Rail Freight Formula
```typescript
const quantity = selectedSchedule.quantity_t
const distance = 850 // km (port to plant)
const ratePerKmPerTonne = 0.95 // ₹

const railFreight = (quantity * distance * ratePerKmPerTonne) / 10000000 // Convert to Cr
const loadingCharges = 0.45 // Cr
const insurance = 0.15 // Cr

const totalRailCost = railFreight + loadingCharges + insurance
```

### Rakes Calculation
```typescript
const RAKE_CAPACITY = 3500 // tonnes per rake
const rakesRequired = Math.ceil(quantity_t / RAKE_CAPACITY)
```

### Demurrage Calculation
```typescript
const DEMURRAGE_RATE = 4500000 // ₹45 lakh per day
const delayDays = 3 // or 5 depending on scenario

const demurrageCost = (DEMURRAGE_RATE * delayDays) / 10000000 // Convert to Cr
```

## Business Value

### For Logistics Team
1. **Quantified Risks**: See exact financial impact of delays
2. **Cost Justification**: Data to support routing decisions
3. **Budget Planning**: Anticipate potential cost overruns
4. **Mitigation ROI**: Calculate savings from preventive actions

### For Management
1. **Financial Visibility**: Clear cost implications of scenarios
2. **Decision Support**: Data-driven route selection
3. **Risk Assessment**: Understand financial exposure
4. **Performance Metrics**: Track cost savings achieved

### For Finance Team
1. **Cost Forecasting**: Predict logistics expenses
2. **Budget Variance**: Explain cost deviations
3. **Savings Tracking**: Measure optimization benefits
4. **Audit Trail**: Document cost decisions

## Real-World Application

### Scenario 1: Weather Delay
**Situation**: Cyclone forecast during transit
**Cost Impact**: ₹4.40 Cr potential loss
**Decision**: Reroute via southern route (+₹0.8 Cr)
**Outcome**: Net savings of ₹3.6 Cr

### Scenario 2: Port Congestion
**Situation**: 8 vessels waiting at selected port
**Cost Impact**: ₹6.30 Cr potential loss
**Decision**: Divert to Paradip Port (₹2.5 Cr cost)
**Outcome**: Net savings of ₹3.8 Cr

### Scenario 3: Route Optimization
**Situation**: Alternative port available
**Cost Impact**: ₹2.0 Cr savings opportunity
**Decision**: Switch to Paradip Port
**Outcome**: Immediate ₹2.0 Cr savings

## Integration with Existing Systems

### Data Sources
- **Schedule Data**: quantity_t, selected_port, target_plant_code
- **Port Data**: Congestion levels, charges
- **Rail Data**: Distance, rates, capacity
- **Weather Data**: Forecasts, risk levels
- **Historical Data**: Average demurrage, delays

### Future Enhancements
1. **Real-time Cost Updates**: Live demurrage tracking
2. **Historical Cost Analysis**: Compare predicted vs actual
3. **Cost Optimization AI**: ML-based route suggestions
4. **Budget Integration**: Link to financial systems
5. **Cost Alerts**: Notify when costs exceed thresholds
6. **Savings Dashboard**: Track cumulative savings
7. **Benchmark Comparison**: Compare against industry standards

## Testing Checklist

- [x] Cost calculations display correctly
- [x] Dynamic values update based on schedule
- [x] All cost breakdowns are accurate
- [x] Totals calculate correctly
- [x] Color coding is consistent
- [x] Mitigation suggestions are relevant
- [x] Comparison tables align properly
- [x] Mobile responsive layout works
- [x] No calculation errors
- [x] Currency formatting is correct (₹X.XX Cr)

## Performance Impact
- ✅ Minimal: Simple arithmetic calculations
- ✅ No API calls required
- ✅ Instant rendering
- ✅ No impact on page load time

---

**Implementation Date**: December 2025
**Status**: ✅ Complete and Production Ready
**Business Impact**: High - Enables data-driven financial decisions
