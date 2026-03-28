import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolCallLabel } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// --- getToolCallLabel ---

test("str_replace_editor create returns Creating <filename>", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "create", path: "/src/components/Card.tsx" })).toBe("Creating Card.tsx");
});

test("str_replace_editor str_replace returns Editing <filename>", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "str_replace", path: "/src/App.tsx" })).toBe("Editing App.tsx");
});

test("str_replace_editor insert returns Editing <filename>", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "insert", path: "/src/index.ts" })).toBe("Editing index.ts");
});

test("str_replace_editor view returns Reading <filename>", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "view", path: "/src/utils.ts" })).toBe("Reading utils.ts");
});

test("str_replace_editor undo_edit returns Undoing edit in <filename>", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "undo_edit", path: "/src/styles.css" })).toBe("Undoing edit in styles.css");
});

test("str_replace_editor unknown command falls back to Editing <filename>", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "unknown", path: "/src/foo.ts" })).toBe("Editing foo.ts");
});

test("file_manager delete returns Deleting <filename>", () => {
  expect(getToolCallLabel("file_manager", { command: "delete", path: "/src/old.tsx" })).toBe("Deleting old.tsx");
});

test("file_manager rename returns Renaming <from> to <to>", () => {
  expect(
    getToolCallLabel("file_manager", { command: "rename", path: "/src/Button.tsx", new_path: "/src/components/Button.tsx" })
  ).toBe("Renaming Button.tsx to Button.tsx");
});

test("file_manager rename with different filenames", () => {
  expect(
    getToolCallLabel("file_manager", { command: "rename", path: "/src/OldName.tsx", new_path: "/src/NewName.tsx" })
  ).toBe("Renaming OldName.tsx to NewName.tsx");
});

test("file_manager unknown command returns Managing <filename>", () => {
  expect(getToolCallLabel("file_manager", { command: "copy", path: "/src/file.ts" })).toBe("Managing file.ts");
});

test("unknown toolName returns toolName as-is", () => {
  expect(getToolCallLabel("some_other_tool", { path: "/src/file.ts" })).toBe("some_other_tool");
});

test("missing path falls back to 'file'", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "create" })).toBe("Creating file");
});

test("nested path extracts basename correctly", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "str_replace", path: "/a/b/c/deep.tsx" })).toBe("Editing deep.tsx");
});

// --- ToolCallBadge component ---

test("shows spinner when state is call", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/src/Card.tsx" }} state="call" />);
  expect(screen.getByTestId("spinner")).toBeDefined();
  expect(screen.queryByTestId("done-indicator")).toBeNull();
});

test("shows spinner when state is partial-call", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/src/Card.tsx" }} state="partial-call" />);
  expect(screen.getByTestId("spinner")).toBeDefined();
});

test("shows done indicator when state is result", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/src/Card.tsx" }} state="result" />);
  expect(screen.getByTestId("done-indicator")).toBeDefined();
  expect(screen.queryByTestId("spinner")).toBeNull();
});

test("renders human-readable label for str_replace_editor create", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/src/Card.tsx" }} state="result" />);
  expect(screen.getByText("Creating Card.tsx")).toBeDefined();
});

test("renders human-readable label for str_replace_editor str_replace", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "str_replace", path: "/src/App.tsx" }} state="call" />);
  expect(screen.getByText("Editing App.tsx")).toBeDefined();
});

test("renders human-readable label for file_manager delete", () => {
  render(<ToolCallBadge toolName="file_manager" args={{ command: "delete", path: "/src/old.tsx" }} state="result" />);
  expect(screen.getByText("Deleting old.tsx")).toBeDefined();
});

test("renders human-readable label for file_manager rename", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "rename", path: "/src/Old.tsx", new_path: "/src/New.tsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Renaming Old.tsx to New.tsx")).toBeDefined();
});

test("renders raw toolName for unknown tools", () => {
  render(<ToolCallBadge toolName="custom_tool" args={{}} state="result" />);
  expect(screen.getByText("custom_tool")).toBeDefined();
});
