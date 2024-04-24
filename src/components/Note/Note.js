import { useEffect, useState } from "react";
import { Button } from "../Button/Button";
import "./Note.css";

export function Note({
  id,
  title: initialTitle,
  content: initialContent,
  onSubmit,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [id, initialTitle, initialContent]);

  const updateNote = async () => {
    const response = await fetch(`/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        lastUpdatedAt: new Date(),
      }),
    });

    const updatedNote = await response.json();
    onSubmit(id, updatedNote);
  };

  return (
    <form
      className="Form"
      onSubmit={(event) => {
        event.preventDefault();
        updateNote();
      }}
    >
      <input
        className="Note-editable Note-title"
        type="text"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
      />
      <textarea
        className="Note-editable Note-content"
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
        }}
      />
      <div className="Note-actions">
        <Button>Enregistrer</Button>
      </div>
    </form>
  );
}
