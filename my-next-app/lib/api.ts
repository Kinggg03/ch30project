// 타입은 백엔드 DTO와 같은 모양이다.
// 뼈대 버전은 Route Handler를 거치지 않고 스프링(8080)을 직접 부른다.
// CORS는 백엔드 @CrossOrigin이 허락한다.

export type Todo = {
  id: number;
  title: string;
  subject: string;
  todoDate: string; // "2026-10-26"
  done: boolean;
};

const BASE = "http://localhost:8080/api/todos";

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(BASE, { cache: "no-store" });
  return res.json();
}

export async function createTodo(body: Omit<Todo, "id" | "done">): Promise<Todo> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateTodo(id: number, body: Omit<Todo, "id" | "done">): Promise<Todo> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function toggleTodo(id: number): Promise<Todo> {
  const res = await fetch(`${BASE}/${id}/toggle`, { method: "PUT" });
  return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
  await fetch(`${BASE}/${id}`, { method: "DELETE" });
}

// ---- 플래너 전체 상태 (명언/D-day/테마/시간바) ----

export type PlannerState = {
  id: string; // 날짜 "2026-11-08"
  comment: string;
  ddayDate: string;
  theme: string;
  oneColor: boolean;
  slots: string; // 쉼표로 이은 108칸, 빈 칸은 ""
  memo: string; // 그날 간략 메모
};

const STATE_BASE = "http://localhost:8080/api/planner-state";

export async function getPlannerState(date: string): Promise<PlannerState | null> {
  const res = await fetch(`${STATE_BASE}/${date}`, { cache: "no-store" });
  if (!res.ok) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function getPlannerStates(): Promise<PlannerState[]> {
  const res = await fetch(STATE_BASE, { cache: "no-store" });
  return res.json();
}

export async function savePlannerState(date: string, body: Omit<PlannerState, "id">): Promise<PlannerState> {
  const res = await fetch(`${STATE_BASE}/${date}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}
