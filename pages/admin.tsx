import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SUPABASE_API_KEY = ""; // FILL IN
const SUPABASE_URL = ""; // FILL IN

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

export default function Admin() {
  const [data, setData] = useState([] as any[]);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("income").select("*");
      if (data) setData(data);
      console.log(data);
    })();
  }, []);

  return (
    <>
      <ComposedChart
        width={500}
        height={400}
        data={data || null}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="date" scale="band" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total_income" barSize={20} fill="#413ea0" />
      </ComposedChart>
      <ComposedChart
        width={500}
        height={400}
        data={data || null}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="date" scale="band" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="cumulative_income"
          fill="#8884d8"
          stroke="#8884d8"
        />
      </ComposedChart>
    </>
  );
}
