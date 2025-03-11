import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import AddTask from "@/components/AddTask";

const TestPage = () => {
  return (
    <div>
      <Popover>
        <PopoverTrigger>Add Task</PopoverTrigger>
        <PopoverContent>
          <AddTask />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TestPage;
