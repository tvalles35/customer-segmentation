import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Select } from "./components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function CustomerSegmentationTool() {
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const [selectedXAxis, setSelectedXAxis] = useState("industry");
  const [selectedYAxis, setSelectedYAxis] = useState("monthlyPremium");

  const handleXAxisChange = (event) => {
    setSelectedXAxis(event.target.value);
  };

  const handleYAxisChange = (event) => {
    setSelectedYAxis(event.target.value);
  };

  const generateDummyData = () => {
    const dummyData = Array.from({ length: 100 }, (_, i) => {
      const monthlyPremium = Math.floor(Math.random() * 400) + 100;
      const employerContribution = Math.floor(Math.random() * 250) + 50;
      const revenue = monthlyPremium + employerContribution;
      const profitabilityScore = ((monthlyPremium - employerContribution) / monthlyPremium) * 100;
      const churnRisk = employerContribution / monthlyPremium < 0.5 ? "High" : "Low";

      return {
        id: i + 1,
        companySize: Math.floor(Math.random() * 490) + 10,
        industry: ["Tech", "Finance", "Healthcare", "Retail"][Math.floor(Math.random() * 4)],
        employeeAge: Math.floor(Math.random() * 47) + 18,
        monthlyPremium,
        employerContribution,
        acaTier: ["Bronze", "Silver", "Gold", "Platinum"][Math.floor(Math.random() * 4)],
        fipsCode: Math.floor(Math.random() * 89999) + 10000,
        revenue,
        profitabilityScore,
        churnRisk,
      };
    });
    setData(dummyData);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Customer Segmentation & Profitability Tool</h1>
      <Button onClick={generateDummyData} className="mb-4">Generate Dummy Data</Button>
      <Button onClick={() => setShowTable(!showTable)} className="mb-4">{showTable ? "Hide Table" : "Show Table"}</Button>
      
      <div className="flex gap-4 mb-4">
        <label className="text-sm font-semibold">X-Axis:</label>
        <Select value={selectedXAxis} onChange={handleXAxisChange}>
          <option value="industry">Industry</option>
          <option value="acaTier">ACA Tier</option>
          <option value="fipsCode">FIPS Code</option>
          <option value="companySize">Company Size</option>
        </Select>
        
        <label className="text-sm font-semibold">Y-Axis:</label>
        <Select value={selectedYAxis} onChange={handleYAxisChange}>
          <option value="monthlyPremium">Monthly Premium</option>
          <option value="employerContribution">Employer Contribution</option>
          <option value="revenue">Revenue</option>
          <option value="profitabilityScore">Profitability Score</option>
        </Select>
      </div>
      
      {showTable && data.length > 0 && (
        <Card className="p-4 mb-4">
          <CardContent>
            <h2 className="text-lg font-bold mb-2">Generated Dummy Data</h2>
            <div className="overflow-auto">
              <table className="min-w-full border-collapse border border-gray-400 text-center">
                <thead>
                  <tr className="bg-gray-200 border border-gray-500">
                    <th className="border border-gray-500 px-4 py-2">Industry</th>
                    <th className="border border-gray-500 px-4 py-2">Company Size</th>
                    <th className="border border-gray-500 px-4 py-2">Employee Age</th>
                    <th className="border border-gray-500 px-4 py-2">Monthly Premium</th>
                    <th className="border border-gray-500 px-4 py-2">Employer Contribution</th>
                    <th className="border border-gray-500 px-4 py-2">ACA Tier</th>
                    <th className="border border-gray-500 px-4 py-2">Revenue</th>
                    <th className="border border-gray-500 px-4 py-2">Profitability Score</th>
                    <th className="border border-gray-500 px-4 py-2">Churn Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 10).map((row, index) => (
                    <tr key={row.id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} border border-gray-500`}>
                      <td className="border border-gray-500 px-4 py-2">{row.industry}</td>
                      <td className="border border-gray-500 px-4 py-2">{row.companySize}</td>
                      <td className="border border-gray-500 px-4 py-2">{row.employeeAge}</td>
                      <td className="border border-gray-500 px-4 py-2">${row.monthlyPremium}</td>
                      <td className="border border-gray-500 px-4 py-2">${row.employerContribution}</td>
                      <td className="border border-gray-500 px-4 py-2">{row.acaTier}</td>
                      <td className="border border-gray-500 px-4 py-2">${row.revenue}</td>
                      <td className="border border-gray-500 px-4 py-2">{row.profitabilityScore.toFixed(2)}%</td>
                      <td className="border border-gray-500 px-4 py-2">{row.churnRisk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {data.length > 0 && (
        <Card className="p-4 mb-4">
          <CardContent>
            <h2 className="text-lg font-bold mb-2">Graphical Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey={selectedXAxis} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={selectedYAxis} fill="#8884d8" name={selectedYAxis} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

