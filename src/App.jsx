import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function CustomerSegmentationTool() {
  const [data, setData] = useState([]);
  const [profitability, setProfitability] = useState(null);
  const [churnRisk, setChurnRisk] = useState(null);
  const [industryProfitability, setIndustryProfitability] = useState(null);

  const generateDummyData = () => {
    const dummyData = Array.from({ length: 100 }, (_, i) => ({
      companySize: Math.floor(Math.random() * 500) + 10,
      industry: ["Tech", "Finance", "Healthcare", "Retail"][Math.floor(Math.random() * 4)],
      employeeAge: Math.floor(Math.random() * 40) + 20,
      monthlyPremium: Math.floor(Math.random() * 500) + 100,
      employerContribution: Math.floor(Math.random() * 300) + 50,
      acaTier: ["Bronze", "Silver", "Gold", "Platinum"][Math.floor(Math.random() * 4)],
      fipsCode: Math.floor(Math.random() * 99999) + 10000,
    }));
    setData(dummyData);
  };

  const analyzeProfitability = () => {
    if (data.length === 0) return;
    
    const profitabilityData = data.map((item) => ({
      industry: item.industry,
      profitMargin: item.monthlyPremium - item.employerContribution,
    }));
    
    const aggregatedProfitability = profitabilityData.reduce((acc, item) => {
      if (!acc[item.industry]) acc[item.industry] = { totalProfit: 0, count: 0 };
      acc[item.industry].totalProfit += item.profitMargin;
      acc[item.industry].count += 1;
      return acc;
    }, {});
    
    const profitabilityInsights = Object.keys(aggregatedProfitability).map((industry) => ({
      industry,
      avgProfit: aggregatedProfitability[industry].totalProfit / aggregatedProfitability[industry].count,
    }));
    
    setProfitability(profitabilityInsights);
  };

  const analyzeChurnRisk = () => {
    if (data.length === 0) return;

    const churnRiskData = data.map((item) => ({
      industry: item.industry,
      churnRisk: item.employerContribution / item.monthlyPremium < 0.5 ? "High" : "Low",
    }));
    
    setChurnRisk(churnRiskData);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Customer Segmentation & Profitability Tool</h1>
      <Button onClick={generateDummyData} className="mb-4">Generate Dummy Data</Button>
      <Button onClick={analyzeProfitability} className="mb-4 ml-2">Analyze Profitability</Button>
      <Button onClick={analyzeChurnRisk} className="mb-4 ml-2">Analyze Churn Risk</Button>
      
      {profitability && (
        <Card className="p-4 mb-4">
          <CardContent>
            <h2 className="text-lg font-bold mb-2">Profitability Insights</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitability}>
                <XAxis dataKey="industry" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgProfit" fill="#FF5733" name="Avg Profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {churnRisk && (
        <Card className="p-4">
          <CardContent>
            <h2 className="text-lg font-bold mb-2">Churn Risk Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={churnRisk}>
                <XAxis dataKey="industry" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="churnRisk" fill="#0088FE" name="Churn Risk" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}