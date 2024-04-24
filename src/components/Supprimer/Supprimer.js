import React from "react";
import "./Supprimer.css";   

export function Supprimer({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="Supprimer" onClick={(event) => event.stopPropagation()}>
      <div className="dialog">
        <h2 className="dialog-title">
          Êtes-vous sûr de vouloir supprimer cette note ?
        </h2>
        <div className="dialog-actions">
          <button onClick={onCancel}>Annuler</button>
          <button onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}
