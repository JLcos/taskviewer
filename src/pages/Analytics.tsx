
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from "react";

interface AnalyticsProps {
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
}

const Analytics = ({ disciplines, onAddDiscipline }: AnalyticsProps) => {
  // Dados zerados conforme solicitado
  const [daysData] = useState([
    { name: 'Seg', tarefas: 0 },
    { name: 'Ter', tarefas: 0 },
    { name: 'Qua', tarefas: 0 },
    { name: 'Qui', tarefas: 0 },
    { name: 'Sex', tarefas: 0 },
    { name: 'Sáb', tarefas: 0 },
    { name: 'Dom', tarefas: 0 },
  ]);

  const [statusData] = useState([
    { name: 'Pendente', value: 0 },
    { name: 'Em Andamento', value: 0 },
    { name: 'Concluída', value: 0 },
  ]);

  const COLORS = ['#FFCC80', '#FFB74D', '#66BB6A'];

  return (
    <Layout disciplines={disciplines} onAddDiscipline={onAddDiscipline}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Analíticos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="clay-card">
          <CardHeader>
            <CardTitle>Progresso das Tarefas</CardTitle>
            <CardDescription>Distribuição das tarefas por status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="clay-card">
          <CardHeader>
            <CardTitle>Atividade Semanal</CardTitle>
            <CardDescription>Número de tarefas por dia</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daysData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="tarefas" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="clay-card">
          <CardHeader>
            <CardTitle>Estatísticas de Produtividade</CardTitle>
            <CardDescription>Dados coletados ainda não disponíveis</CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <div className="text-center py-10">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-medium mb-2">Sem dados disponíveis</h3>
              <p className="text-muted-foreground text-center mb-6">
                Adicione tarefas e complete-as para ver as estatísticas de produtividade.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
