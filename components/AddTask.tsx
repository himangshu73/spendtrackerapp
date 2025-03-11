import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const AddTask = () => {
  return (
    <div>
      <Input type="text" className="mb-2" />
      <Input type="number" className="mb-2" />
      <Input type="date" className="mb-2" />
      <Input type="image" className="mb-2" />
      <Button className="bg-blue-500 hover:bg-blue-700">Submit</Button>
    </div>
  );
};

export default AddTask;
