'use client';
// 플래너 로직만 모아둔 훅. 화면(JSX)은 page.tsx에 있어.
// 상태 + 백엔드 불러오기/저장하기 + 할 일 추가/수정/삭제가 여기 있어.

import { useEffect, useState, type FormEvent } from 'react';
import {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  getPlannerState,
  getPlannerStates,
  savePlannerState,
  type Todo,
  type PlannerState,
} from '../../lib/api';
import { type BoardRow, WEEKDAYS } from './boxes';
import {
  daysBetween,
  ddayTextFromDiff,
  formatMinutes,
  emptySlots,
  slotsToString,
  slotsFromString,
} from './helpers';

export function usePlanner() {
  // ---------- 할 일 상태 ----------
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('react');
  const [editId, setEditId] = useState<number | null>(null);

  // ---------- 그날 플래너 상태 ----------
  const [comment, setComment] = useState('오늘도 한 걸음');
  const [ddayDate, setDdayDate] = useState('2026-11-20'); // 오늘(2026-11-08) 기준 D-12
  const [theme, setTheme] = useState('#ff8fab'); // 전체 테마 색
  const [memo, setMemo] = useState('');

  // ---------- 타임테이블 상태 ----------
  const [slots, setSlots] = useState<(string | null)[]>(emptySlots());
  const [paint, setPaint] = useState<boolean | null>(null);
  const [oneColor, setOneColor] = useState(false);

  // ---------- 화면 상태 ----------
  const [viewDate, setViewDate] = useState(new Date().toISOString().slice(0, 10));
  const [savedStates, setSavedStates] = useState<PlannerState[]>([]);
  const [showList, setShowList] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  // ---------- 타임테이블 칸 하나 칠하기 / 지우기 ----------
  function paintSlot(i: number, on: boolean) {
    setSlots((prev) => {
      const next = [...prev];
      if (on) {
        next[i] = subject;
      } else {
        next[i] = null;
      }
      return next;
    });
  }

  function resetSlots() {
    setSlots(emptySlots());
  }

  // ---------- 백엔드에서 가져오기 ----------
  async function load() {
    try {
      const list = await getTodos();
      setTodos(list);
    } catch {
      setTodos([]);
    }
  }

  async function loadDates() {
    try {
      const list = await getPlannerStates();
      setSavedStates(list);
    } catch {
      setSavedStates([]);
    }
  }

  // ---------- 기본값으로 되돌리기 (저장된 게 없을 때) ----------
  function resetPlanner() {
    setComment('오늘도 한 걸음');
    setDdayDate('2026-11-20');
    setTheme('#ff8fab');
    setOneColor(false);
    setSlots(emptySlots());
    setMemo('');
  }

  // ---------- 저장된 값 화면에 넣기 ----------
  function applySavedState(s: PlannerState) {
    setComment(s.comment);
    setDdayDate(s.ddayDate);
    setTheme(s.theme);
    setOneColor(s.oneColor);
    setSlots(slotsFromString(s.slots));
    setMemo(s.memo ?? '');
  }

  // ---------- 날짜를 열면 그날 플래너를 불러와 ----------
  async function openDate(d: string) {
    setViewDate(d);
    setSavedMsg('');
    try {
      const saved = await getPlannerState(d);
      if (!saved) {
        resetPlanner();
        return;
      }
      applySavedState(saved);
    } catch {
      // 불러오기 실패하면 화면은 그대로 둬.
    }
  }

  // ---------- 저장 버튼: 보고 있는 날짜 전체를 DB에 저장해 ----------
  async function saveAll() {
    try {
      await savePlannerState(viewDate, {
        comment,
        ddayDate,
        theme,
        oneColor,
        slots: slotsToString(slots),
        memo,
      });
      setSavedMsg('저장됨 ✓');
      loadDates();
    } catch {
      setSavedMsg('저장 실패 — 백엔드(8080) 확인해봐');
    }
  }

  // 처음 화면 열 때 한 번만 실행돼.
  useEffect(() => {
    load();
    openDate(today);
    loadDates();
  }, []);

  // ---------- 화면에 보여줄 값들 계산하기 ----------
  const diff = daysBetween(viewDate, ddayDate);
  const ddayText = ddayTextFromDiff(diff);
  const weekday = WEEKDAYS[new Date(viewDate + 'T00:00:00').getDay()];

  // 오늘 할 일만 골라.
  const dayTodos = todos.filter((t) => t.todoDate === viewDate);

  // 총 시간: 채운 10분 칸 수 × 10분.
  const mins = slots.filter(Boolean).length * 10;
  const total = formatMinutes(mins);

  // 목록에 쓸 날짜들: 저장된 날짜 + 할 일 있는 날짜, 최신 순.
  const dates = [...new Set([
    ...savedStates.map((s) => s.id),
    ...todos.map((t) => t.todoDate),
  ])].sort().reverse();

  // 게시판 한 줄 만들기: 날짜 / 명언 / D-day / 할 일 개수 / 총 시간.
  function buildBoardRow(d: string): BoardRow {
    const saved = savedStates.find((x) => x.id === d);
    const count = todos.filter((t) => t.todoDate === d).length;

    if (!saved) {
      return { d, comment: '', dday: '', n: count, total: '0H 0M' };
    }

    const filled = saved.slots.split(',').filter(Boolean).length;
    const rowDiff = daysBetween(d, saved.ddayDate);
    return {
      d,
      comment: saved.comment ?? '',
      dday: ddayTextFromDiff(rowDiff),
      n: count,
      total: formatMinutes(filled * 10),
    };
  }

  const rows: BoardRow[] = dates.map((d) => buildBoardRow(d));

  // ---------- 할 일 추가 / 수정 ----------
  async function submit(e: FormEvent) {
    e.preventDefault();
    const body = { title, subject, todoDate: viewDate };

    if (editId !== null) {
      await updateTodo(editId, body);
      setEditId(null);
    } else {
      await createTodo(body);
    }

    setTitle('');
    load();
  }

  // ---------- 할 일 버튼들 ----------
  async function handleToggle(id: number) {
    await toggleTodo(id);
    load();
  }

  function handleEdit(t: Todo) {
    setEditId(t.id);
    setTitle(t.title);
    setSubject(t.subject);
  }

  async function handleDelete(id: number) {
    await deleteTodo(id);
    load();
  }

  function handleDateChange(value: string) {
    if (value) {
      openDate(value);
    }
  }

  function handleOpenFromList(d: string) {
    openDate(d);
    setShowList(false);
  }

  function toggleList() {
    setShowList((v) => !v);
  }

  // page.tsx가 쓸 것들을 한 번에 돌려줘.
  return {
    title, setTitle,
    subject, setSubject,
    editId,
    comment, setComment,
    ddayDate, setDdayDate,
    theme, setTheme,
    memo, setMemo,
    slots, paint, setPaint,
    oneColor, setOneColor,
    viewDate,
    showList, savedMsg,
    ddayText, total, weekday,
    dayTodos, rows,
    paintSlot, resetSlots,
    saveAll, submit,
    handleToggle, handleEdit, handleDelete,
    handleDateChange, handleOpenFromList, toggleList,
  };
}
