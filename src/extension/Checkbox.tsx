function Checkbox({ label, checked, onClick }) {
  return (
    <label>
      <input type="checkbox" checked={checked} onClick={onClick} />
      <span> </span>
      {label}
    </label>
  );
}

export default Checkbox;
