import React from 'react';
import styles from './select.module.css';

const Select = (props) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{props.label}</label>
      <select
        className={styles.select}
        value={props.value}
        onChange={props.onChange}
        required={props.required}
        disabled={props.disabled}
      >
        <option value="" disabled hidden>
          {props.title}
        </option>
        {props.object.map((data) => {
          return (
            <option key={data._id} value={data._id}>
              {data.name || `${data.firstName} ${data.lastName}`}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;
