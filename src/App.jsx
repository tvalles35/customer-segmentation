import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Papa from "papaparse";

export default function CustomerSegmentationTool() {
  const [data, setData] = useState([]);
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [sortDescending, setSortDescending] = useState(false);
  const [insights, setInsights] = useState("");

  const discreteDataKeys = ["state", "industry", "acaTier", "planType"];
  const continuousDataKeys = ["monthlyPremium", "employerContribution", "revenue", "profitabilityScore", "claimFrequency", "employeeAge", "companySize"];

  const customerSupportAndOnboardingCosts = 300; // Example customer support and onboarding costs
  const financialCosts = 100; // Example financial costs
  const brokerCommission = 200; // Example broker commission

  const calculateProfitabilityScore = (monthlyPremium, employerContribution) => {
    const annualRevenue = monthlyPremium * 12;
    const annualProfit = annualRevenue - employerContribution - customerSupportAndOnboardingCosts - financialCosts - brokerCommission;
    return (annualProfit / annualRevenue) * 100;
  };

  const generateInsights = (dataset) => {
    if (!dataset.length) return;

    const avgProfitability = dataset.reduce((sum, d) => sum + d.profitabilityScore, 0) / dataset.length;
    const mostProfitableIndustry = dataset.reduce((acc, d) => {
      acc[d.industry] = (acc[d.industry] || 0) + d.profitabilityScore;
      return acc;
    }, {});
    const highestIndustry = Object.keys(mostProfitableIndustry).reduce((a, b) => mostProfitableIndustry[a] > mostProfitableIndustry[b] ? a : b);

    const leastProfitableIndustry = Object.keys(mostProfitableIndustry).reduce((a, b) => mostProfitableIndustry[a] < mostProfitableIndustry[b] ? a : b);

    const avgMonthlyPremium = dataset.reduce((sum, d) => sum + d.monthlyPremium, 0) / dataset.length;
    const avgEmployerContribution = dataset.reduce((sum, d) => sum + d.employerContribution, 0) / dataset.length;
    const avgClaimFrequency = dataset.reduce((sum, d) => sum + d.claimFrequency, 0) / dataset.length;

    const topCustomers = dataset.sort((a, b) => b.profitabilityScore - a.profitabilityScore).slice(0, 5);
    const bottomCustomers = dataset.sort((a, b) => a.profitabilityScore - b.profitabilityScore).slice(0, 5);

    setInsights(`Profitability Score represents the annual profit per customer after accounting for various costs and contributions. Higher scores indicate more profitable customers. \n`
      + `The average profitability score is ${avgProfitability.toFixed(2)}%. \n`
      + `The most profitable industry segment is ${highestIndustry}. \n`
      + `The least profitable industry segment is ${leastProfitableIndustry}. \n`
      + `The average monthly premium is $${avgMonthlyPremium.toFixed(2)}. \n`
      + `The average employer contribution is $${avgEmployerContribution.toFixed(2)}. \n`
      + `The average claim frequency is ${avgClaimFrequency.toFixed(2)} claims per month. \n`
      + `Top 5 most profitable customers: ${topCustomers.map(c => c.companyName).join(", ")}. \n`
      + `Top 5 least profitable customers: ${bottomCustomers.map(c => c.companyName).join(", ")}.`);
  };

  const generateDummyData = () => {
    const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
    const companyNames = ["Acme Corp", "Globex Corporation", "Soylent Corp", "Initech", "Umbrella Corp", "Hooli", "Vehement Capital Partners", "Massive Dynamic", "Stark Industries", "Wayne Enterprises"];
    const dummyData = Array.from({ length: 100 }, (_, i) => {
      const monthlyPremium = Math.floor(Math.random() * 400) + 100;
      const employerContribution = Math.floor(Math.random() * 250) + 50;
      const profitabilityScore = calculateProfitabilityScore(monthlyPremium, employerContribution);
      const state = states[i % states.length];
      const companyName = companyNames[i % companyNames.length];
      const employeeTenure = Math.floor(Math.random() * 30) + 1;
      const planType = ["Individual", "Family", "Dependent"][Math.floor(Math.random() * 3)];
      const claimFrequency = Math.floor(Math.random() * 10);
      const companySize = Math.floor(Math.random() * 490) + 10; // Ensure companySize is included

      return {
        id: i + 1,
        companyName,
        companySize,
        industry: ["Tech", "Finance", "Healthcare", "Retail"][Math.floor(Math.random() * 4)],
        employeeAge: Math.floor(Math.random() * 47) + 18,
        monthlyPremium,
        employerContribution,
        acaTier: ["Bronze", "Silver", "Gold"][Math.floor(Math.random() * 3)],
        fipsCode: Math.floor(Math.random() * 89999) + 10000,
        revenue: monthlyPremium + employerContribution,
        profitabilityScore,
        state,
        employeeTenure,
        planType,
        claimFrequency,
      };
    });
    console.log(dummyData); // Debugging: Log the generated dummy data
    setData(dummyData);
    generateInsights(dummyData);
    setStep(2);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          const parsedData = result.data.map(d => {
            return {
              ...d,
              profitabilityScore: calculateProfitabilityScore(d.monthlyPremium, d.employerContribution),
            };
          });
          console.log(parsedData); // Debugging: Log the parsed data
          setData(parsedData);
          generateInsights(parsedData);
          setStep(2);
        },
      });
    }
  };

  const renderChart = (xAxis, yAxis, chartType) => {
    let sortedData = [...data];
    if (xAxis === "employeeAge" || xAxis === "companySize") {
      sortedData = sortedData.sort((a, b) => a[xAxis] - b[xAxis]);
    } else {
      sortedData = sortedData.sort((a, b) => sortDescending ? b[yAxis] - a[yAxis] : a[yAxis] - b[yAxis]);
    }

    console.log(sortedData); // Debugging: Log the sorted data

    switch (chartType) {
      case "LineChart":
        return (
          <LineChart data={sortedData}>
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
          </LineChart>
        );
      case "ScatterChart":
        return (
          <ScatterChart>
            <XAxis dataKey={xAxis} />
            <YAxis dataKey={yAxis} /> {/* Ensure yAxis is set */}
            <Tooltip />
            <Legend />
            <Scatter data={sortedData} fill="#8884d8" />
          </ScatterChart>
        );
      default:
        return (
          <BarChart data={sortedData}>
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxis} fill="#8884d8" />
          </BarChart>
        );
    }
  };

  const renderAcaTierChart = () => {
    const acaTierData = [
      { name: "Bronze", avgProfitability: data.filter(d => d.acaTier === "Bronze").reduce((sum, d) => sum + d.profitabilityScore, 0) / data.filter(d => d.acaTier === "Bronze").length },
      { name: "Silver", avgProfitability: data.filter(d => d.acaTier === "Silver").reduce((sum, d) => sum + d.profitabilityScore, 0) / data.filter(d => d.acaTier === "Silver").length },
      { name: "Gold", avgProfitability: data.filter(d => d.acaTier === "Gold").reduce((sum, d) => sum + d.profitabilityScore, 0) / data.filter(d => d.acaTier === "Gold").length },
    ];

    return (
      <BarChart data={acaTierData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="avgProfitability" fill="#8884d8" />
      </BarChart>
    );
  };

  const chartCombinations = [
    { xAxis: "companySize", yAxis: "profitabilityScore", chartType: "BarChart" },
    { xAxis: "state", yAxis: "profitabilityScore", chartType: "BarChart" },
    { xAxis: "employeeAge", yAxis: "profitabilityScore", chartType: "BarChart" },
    { xAxis: "acaTier", yAxis: "profitabilityScore", chartType: "Custom", renderChart: renderAcaTierChart },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Customer Segmentation & Profitability Tool</h1>
      <div className="mb-4">
        <h2 className="text-lg font-bold">Profitability Score</h2>
        <p>
          The profitability score represents the annual profit per customer after accounting for various costs and contributions. 
          It is calculated as follows:
        </p>
        <p>
          <strong>Annual Profit per Customer = (Admin Fee per Year) + (Commission from Carriers) - (Customer Support and Onboarding Costs) - (Financial Costs)</strong>
        </p>
        <p>
          Higher scores indicate more profitable customers.
        </p>
      </div>
      {step === 1 && (
        <div>
          <Button onClick={generateDummyData} className="mr-2">Generate Dummy Data</Button>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="ml-2" />
        </div>
      )}
      {step === 2 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Data Analysis</h2>
          <div className="tabs">
            {chartCombinations.map((combination, index) => (
              <button
                key={index}
                className={`tab ${activeTab === index ? "active" : ""}`}
                onClick={() => setActiveTab(index)}
              >
                {combination.xAxis} vs {combination.yAxis}
              </button>
            ))}
          </div>
          <div className="tab-content">
            <ResponsiveContainer width="100%" height={300}>
              {chartCombinations[activeTab].chartType === "Custom"
                ? chartCombinations[activeTab].renderChart()
                : renderChart(chartCombinations[activeTab].xAxis, chartCombinations[activeTab].yAxis, chartCombinations[activeTab].chartType)}
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {insights && (
        <Card className="p-4 mb-4">
          <CardContent>
            <h2 className="text-lg font-bold">Insights</h2>
            <p>{insights}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}