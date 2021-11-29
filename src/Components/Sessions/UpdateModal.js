import styles from './sessions.module.css';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const UpdateModal = ({ onCancel, onUpdate, session }) => {
  const [Postulants, setPostulants] = useState([]);
  const [Psychologists, setPsychologists] = useState([]);
  const [Postulant, setPostulant] = useState(session.postulant._id);
  const [Psychologist, setPsychologist] = useState(session.psychologist._id);
  const [Status, setStatus] = useState(session.status);
  const [Date, setDate] = useState(session.date);
  const [Notes, setNotes] = useState(session.notes);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/postulants`)
      .then((response) => response.json())
      .then((response) => {
        const array = response.data.map((postulant) => {
          return {
            id: postulant._id,
            fullName: `${postulant.firstName} ${postulant.lastName}`
          };
        });
        setPostulants(array);
      });
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/psychologists`)
      .then((response) => response.json())
      .then((response) => {
        const array = response.data.map((psychologist) => {
          return {
            id: psychologist._id,
            fullName: `${psychologist.firstName} ${psychologist.lastName}`
          };
        });
        setPsychologists(array);
      });
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    onUpdate({
      id: session._id,
      postulant: Postulant,
      psychologist: Psychologist,
      status: Status,
      date: Date,
      notes: Notes
    });
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h3>Update Session</h3>
        <FaTimes onClick={() => onCancel()} />
      </div>
      <form className={styles.createForm} onSubmit={onSubmit}>
        <div className={styles.inputContainer}>
          <label htmlFor="postulant">
            Postulant
            <select
              name="postulant"
              id="postulant"
              value={Postulant}
              onChange={(e) => setPostulant(e.target.value)}
            >
              {Postulants.map((postulant) => {
                return (
                  <option key={postulant.id} value={`${postulant.id}`}>
                    {postulant.fullName}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="psychologist">
            Psychologist
            <select
              name="psychologist"
              id="psychologist"
              value={Psychologist}
              onChange={(e) => setPsychologist(e.target.value)}
            >
              {Psychologists.map((psychologist) => {
                return (
                  <option key={psychologist.id} value={`${psychologist.id}`}>
                    {psychologist.fullName}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="status">
            Status
            <select
              name="status"
              id="status"
              value={Status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="assigned">Assigned</option>
              <option value="cancelled">Cancelled</option>
              <option value="succesful">Succesful</option>
            </select>
          </label>
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="date">
            Date
            <input
              type="datetime-local"
              name="date"
              id="date"
              value={session.date}
              onChange={(e) => setDate(e.target.value)}
            ></input>
          </label>
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="notes" className={styles.notes}>
            Notes
            <input
              type="text"
              name="notes"
              id="notes"
              value={session.notes}
              onChange={(e) => setNotes(e.target.value)}
            ></input>
          </label>
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="submit">
            <input className={styles.submitBtn} type="submit" value="Update" />
          </label>
        </div>
      </form>
    </div>
  );
};

export default UpdateModal;
