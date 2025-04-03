
export type TaskStatus = "pendente" | "em-andamento" | "concluída";

export interface Task {
  id: string;
  title: string;
  description: string;
  discipline: string;
  status: TaskStatus;
  dueDate: string;
}
