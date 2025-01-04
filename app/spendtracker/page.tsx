"use client";

import { itemSchema } from "@/schemas/itemSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import axios from "axios";
import { useSession, signIn } from "next-auth/react";
import { useDebounce } from "use-debounce";

type ItemType = z.infer<typeof itemSchema>;

const SpendTracker = () => {
  const [items, setItems] = useState<ItemType[]>([]);
  const { data: session, status } = useSession();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [categoryQuery, setCategoryQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [debouncedCategoryQuery] = useDebounce(categoryQuery, 300);
  const [loading, setLoading] = useState<boolean>(true);

  const form = useForm<ItemType>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      itemname: "",
      category: "",
      quantity: undefined,
      price: undefined,
      unit: "kg",
    },
  });

  console.log(debouncedQuery);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery) {
        setSuggestions([]);
        setCategorySuggestions([]);
        form.setValue("category", "");
        return;
      }

      try {
        const response = await axios.get(
          `/api/items/suggestions?query=${debouncedQuery}&field=itemname`
        );

        const { exactMatch, suggestions } = response.data;

        if (exactMatch) {
          form.setValue("category", exactMatch.category);
          setCategorySuggestions([]);
        } else {
          form.setValue("category", "");
        }
        setSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setCategorySuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    const fetchCategorySuggestions = async () => {
      if (!debouncedCategoryQuery) {
        setCategorySuggestions([]);
        return;
      }

      try {
        const response = await axios.get(
          `/api/items/suggestions?query=${debouncedCategoryQuery}&field=category`
        );

        const { categorySuggestions } = response.data;
        setCategorySuggestions(categorySuggestions);
      } catch (error) {
        console.error("Error fetching category suggestions:", error);
        setCategorySuggestions([]);
      }
    };
    fetchCategorySuggestions();
  }, [debouncedCategoryQuery]);

  const onSubmit = async (values: ItemType) => {
    try {
      const response = await axios.post("/api/additem", values);
      setItems((prevItems) => [...prevItems, values]);
      form.reset();
      setQuery("");
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };
  if (!session) {
    return (
      <div>
        <p>Please sign in to continue..</p>
        <Button onClick={() => signIn()}>Sign In</Button>
      </div>
    );
  }
  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="itemname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Item Name"
                      {...field}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        field.onChange(e.target.value);
                      }}
                    />
                    {suggestions?.length > 0 && (
                      <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md mt-1 max-h-40 overflow-auto">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                              field.onChange(suggestion);
                              setQuery(suggestion);
                              setSuggestions([]);
                            }}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Category"
                      {...field}
                      onChange={(e) => {
                        setCategoryQuery(e.target.value);
                        field.onChange(e.target.value);
                      }}
                    />
                    {categorySuggestions?.length > 0 && (
                      <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md mt-1 max-h-40 overflow-auto">
                        {categorySuggestions.map((category, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                              field.onChange(category);
                              setCategoryQuery(category);
                              setCategorySuggestions([]);
                            }}
                          >
                            {category}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogram</SelectItem>
                        <SelectItem value="ltr">Liter</SelectItem>
                        <SelectItem value="pc">Piece</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Price" {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <div className="mt-6">
        <h2 className="text-lg font-bold">Items:</h2>
        <ul className="list-disc pl-6">
          {items.map((item, index) => (
            <li key={index} className="text-gray-700">
              <strong>Name:</strong> {item.itemname}, <strong>Quantity:</strong>{" "}
              {item.quantity} {item.unit}, <strong>Price:</strong> $
              {item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SpendTracker;
