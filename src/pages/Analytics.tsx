
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Task } from "@/types/TaskTypes";

interface AnalyticsProps {
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
  onEditDiscipline: (oldName: string, newName: string) => void;
  onDeleteDiscipline: (name: string) => void;
}

const COLORS = ['#FFCC80', '#FFB74D', '#66BB6A', '#64B5F6', '#7986CB', '#BA68C8'];

const Analytics = ({ disciplines, onAddDiscipline, onEditDiscipline, onDeleteDiscipline }: AnalyticsProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusData, setStatusData] = useState([
    { name: 'Pendente', value: 0 },
    { name: 'Em Andamento', value: 0 },
    { name: 'Concluída', value: 0 },
  ]);
  const [daysData, setDaysData] = useState([
    { name: 'Seg', tarefas: 0 },
    { name: 'Ter', tarefas: 0 },
    { name: 'Qua', tarefas: 0 },
    { name: 'Qui', tarefas: 0 },
    { name: 'Sex', tarefas: 0 },
    { name: 'Sáb', tarefas: 0 },
    { name: 'Dom', tarefas: 0 },
  ]);
  const [disciplineData, setDisciplineData] = useState<{ name: string; tarefas: number }[]>([]);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('task-viewer-tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks);
      
      // Update status data
      const pendingCount = parsedTasks.filter((task: Task) => task.status === 'pendente').length;
      const inProgressCount = parsedTasks.filter((task: Task) => task.status === 'em-andamento').length;
      const completedCount = parsedTasks.filter((task: Task) => task.status === 'concluída').length;
      
      setStatusData([
        { name: 'Pendente', value: pendingCount },
        { name: 'Em Andamento', value: inProgressCount },
        { name: 'Concluída', value: completedCount },
      ]);
      
      // Prepare discipline data
      const disciplineCounts: Record<string, number> = {};
      disciplines.forEach(discipline => {
        disciplineCounts[discipline] = parsedTasks.filter((task: Task) => task.discipline === discipline).length;
      });
      
      setDisciplineData(
        Object.keys(disciplineCounts).map(discipline => ({
          name: discipline,
          tarefas: disciplineCounts[discipline]
        }))
      );
      
      // For now, we just have placeholder day data
      // In a real app, you'd parse due dates and categorize by day of week
    }
  }, [disciplines]);
  
  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    }
  };

  return (
    <Layout disciplines={disciplines} onAddDiscipline={onAddDiscipline} onEditDiscipline={onEditDiscipline} onDeleteDiscipline={onDeleteDiscipline}>
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold">Analíticos</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <Card className="clay-card overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 pb-2">
              <CardTitle className="text-xl font-bold">Progresso das Tarefas</CardTitle>
              <CardDescription>Distribuição das tarefas por status</CardDescription>
            </CardHeader>
            <CardContent className="h-80 pt-6">
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
                    animationDuration={1500}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tarefa(s)`, 'Quantidade']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <Card className="clay-card overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-2">
              <CardTitle className="text-xl font-bold">Atividade Semanal</CardTitle>
              <CardDescription>Número de tarefas por dia</CardDescription>
            </CardHeader>
            <CardContent className="h-80 pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={daysData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} tarefa(s)`, 'Quantidade']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="tarefas" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <Card className="clay-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 pb-2">
            <CardTitle className="text-xl font-bold">Tarefas por Disciplina</CardTitle>
            <CardDescription>Distribuição de tarefas entre disciplinas</CardDescription>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            {disciplineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={disciplineData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} tarefa(s)`, 'Quantidade']} />
                  <Legend />
                  <Bar 
                    dataKey="tarefas" 
                    name="Tarefas" 
                    animationDuration={1500}
                  >
                    {disciplineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-10">
                <motion.div 
                  className="text-6xl mb-4"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  📊
                </motion.div>
                <h3 className="text-xl font-medium mb-2">Sem dados disponíveis</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Adicione tarefas e complete-as para ver as estatísticas por disciplina.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default Analytics;
