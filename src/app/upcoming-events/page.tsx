const AllEventsPage = async () => {
  const res = await fetch("http://localhost:8000/events");
  const data = await res.json();
  console.log(data);

  return (
    <div>
      <h2>Hello</h2>
    </div>
  );
};

export default AllEventsPage;
