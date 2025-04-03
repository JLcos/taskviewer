
import { Layout } from "@/components/Layout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  // Sample data for charts
  const weeklyProgressData = [
    { name: 'Seg', tarefas: 4 },
    { name: 'Ter', tarefas: 6 },
    { name: 'Qua', tarefas: 8 },
    { name: 'Qui', tarefas: 5 },
    { name: 'Sex', tarefas: 10 },
    { name: 'Sab', tarefas: 3 },
    { name: 'Dom', tarefas: 2 },
  ];

  const disciplineDistributionData = [
    { name: 'Matemática', value: 35 },
    { name: 'Português', value: 25 },
    { name: 'Física', value: 20 },
    { name: 'Química', value: 15 },
    { name: 'História', value: 5 },
  ];

  const statusDistributionData = [
    { name: 'Concluídas', value: 45 },
    { name: 'Em Andamento', value: 30 },
    { name: 'Pendentes', value: 25 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];
  const STATUS_COLORS = ['#82ca9d', '#ffc658', '#ff8042'];

  // Sample performance metrics
  const performanceMetrics = [
    { label: 'Taxa de Conclusão', value: '75%' },
    { label: 'Tempo Médio por Tarefa', value: '45 min' },
    { label: 'Tarefas Concluídas no Prazo', value: '87%' },
    { label: 'Disciplinas Ativas', value: '5' }
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analíticos</h1>
        <p className="text-muted-foreground">
          Acompanhe seu progresso e desempenho acadêmico
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="clay-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{metric.label}</h3>
            <p className="text-2xl font-bold">{metric.value}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="clay-card">
          <h2 className="text-xl font-bold mb-6">Progresso Semanal</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyProgressData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '10px', 
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)', 
                    border: 'none' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="tarefas" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.2)" 
                  name="Tarefas Completadas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="clay-card">
          <h2 className="text-xl font-bold mb-6">Distribuição por Disciplina</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={disciplineDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {disciplineDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '10px', 
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)', 
                    border: 'none'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="clay-card lg:col-span-1">
          <h2 className="text-xl font-bold mb-6">Status das Tarefas</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    border: 'none'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="clay-card lg:col-span-2">
          <h2 className="text-xl font-bold mb-6">Relatório de Desempenho</h2>
          <div className="space-y-4">
            <div className="clay-card bg-clay-mint shadow-none">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">Matemática</h3>
                  <p className="text-sm text-muted-foreground">Excelente progresso!</p>
                </div>
                <span className="text-xl font-bold text-green-600">A+</span>
              </div>
              <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="clay-card bg-clay-blue shadow-none">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">Física</h3>
                  <p className="text-sm text-muted-foreground">Bom progresso!</p>
                </div>
                <span className="text-xl font-bold text-blue-600">B+</span>
              </div>
              <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div className="clay-card bg-clay-yellow shadow-none">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">Química</h3>
                  <p className="text-sm text-muted-foreground">Progresso regular</p>
                </div>
                <span className="text-xl font-bold text-yellow-600">C</span>
              </div>
              <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div className="clay-card bg-clay-orange shadow-none">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">História</h3>
                  <p className="text-sm text-muted-foreground">Precisa de atenção</p>
                </div>
                <span className="text-xl font-bold text-orange-600">D</span>
              </div>
              <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
