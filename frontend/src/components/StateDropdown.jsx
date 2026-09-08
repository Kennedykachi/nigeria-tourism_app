function StateDropdown({ selected, onSelect }) {
  // List of Nigerian states (abbreviated for brevity)
  const states = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
    'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ];

  return (
    <select
      value={selected}
      onChange={(e) => onSelect(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      <option value="">All States</option>
      {states.map((state) => (
        <option key={state} value={state}>{state}</option>
      ))}
    </select>
  );
}

export default StateDropdown;