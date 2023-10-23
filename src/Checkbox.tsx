function Checkbox({ text, checked, onClick }) {
  return (
    <label>
      <input type="checkbox" checked={checked} onClick={onClick} />
      <span> </span>
      {text}
    </label>
  );
}

export default Checkbox;
