const FilterForm = ({search, setSearch}) => {
  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  return (
      <form>
        <div>filter shown with <input value={search} onChange={handleSearchChange} /></div>
      </form>)
}

export default FilterForm