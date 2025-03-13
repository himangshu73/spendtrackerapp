"use client";

import { itemSchema } from "@/schemas/itemSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import ItemCard from "@/components/ItemCard";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type ItemType = z.infer<typeof itemSchema>;

const SpendTracker = () => {
  const [items, setItems] = useState<ItemType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [categoryQuery, setCategoryQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [debouncedCategoryQuery] = useDebounce(categoryQuery, 300);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState(0);
  const [categories, setCategories] = useState([]);

  const form = useForm<ItemType>({
    resolver: zodResolver(itemSchema.omit({ _id: true })),
    defaultValues: {
      itemname: "",
      category: "",
      quantity: 0,
      price: 0,
      unit: "kg",
    },
  });

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const response = await axios.get("/api/calculateitem");
        setTotalCost(response.data.totalCost);
        setCategories(response.data.userCategory);
        console.log(response.data.totalCost);
        console.log(response.data.userCategory);
        console.log(totalCost);
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    };
    fetchTotals();
  }, [items]);

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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("/api/showitem");
        console.log(response);
        setItems(response.data.item.reverse());
      } catch (error) {
        console.error("Error fetching items from db:", error);
      }
    };
    fetchItems();
  }, []);

  const onSubmit = async (values: ItemType) => {
    console.log("Submitting form with values: ", values);
    console.log("Is Editing:", isEditing);
    console.log("Editing Item ID:", editingItemId);

    if (isEditing && editingItemId) {
      setSubmitting(true);
      try {
        console.log("Updating item...");
        const response = await axios.put(`/api/updateitem`, {
          ...values,
          _id: editingItemId,
        });

        console.log("Update Response: ", response.data);

        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === editingItemId ? { ...item, ...values } : item
          )
        );
        resetForm();
      } catch (error) {
        console.error("Error updating item:", error);
      } finally {
        setSubmitting(false);
      }
    } else {
      setSubmitting(true);
      try {
        console.log("Adding Items...");
        const formattedvalues = {
          ...values,
          quantity: Number(values.quantity),
          price: Number(values.price),
          itemname:
            values.itemname.charAt(0).toUpperCase() + values.itemname.slice(1),
          category:
            values.category.charAt(0).toUpperCase() + values.category.slice(1),
        };

        const response = await axios.post("/api/additem", formattedvalues);
        setItems((prevItems) => [formattedvalues, ...prevItems]);
        form.reset();
        setQuery("");
        setCategoryQuery("");
      } catch (error) {
        console.error("Error saving item:", error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleEdit = (item: ItemType) => {
    console.log("Editing item:", item);
    setIsEditing(true);
    setEditingItemId(item._id || null);
    setQuery(item.itemname);
    console.log("Editing item:", item);
    form.setValue("itemname", item.itemname);
    form.setValue("category", item.category);
    form.setValue("quantity", item.quantity);
    form.setValue("price", item.price);
    form.setValue("unit", item.unit);
  };

  const resetForm = () => {
    form.reset({
      itemname: "",
      category: "",
      quantity: 0,
      price: 0,
      unit: "kg",
    });
    setIsEditing(false);
    setEditingItemId(null);
    setQuery("");
  };

  const handleDeleteItem = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/deleteitem`, { data: { id } });
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }
  if (status === "unauthenticated") {
    return (
      <div>
        <p>Please sign in to continue..</p>
        <Button onClick={() => signIn()}>Sign In</Button>
      </div>
    );
  }
  if (status === "authenticated") {
    return (
      <div className="p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-96"
          >
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
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button type="submit">
                {isEditing ? (
                  <div>{submitting ? "Updating" : "Update"}</div>
                ) : (
                  <div>{submitting ? "Submitting" : "Submit"}</div>
                )}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
        <div>Total Cost: {totalCost}</div>
        <div>
          Categories:{" "}
          <ul>
            {categories.map((category, index) => (
              <li key={index}>{category}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
          {items.map((item, index) => (
            <ItemCard
              key={index}
              item={item}
              onDelete={() => handleDeleteItem(item._id)}
              updateItem={() => handleEdit(item)}
            />
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default SpendTracker;
