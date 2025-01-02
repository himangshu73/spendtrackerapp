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
import { useState } from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import axios from "axios";
import { useSession, signIn } from "next-auth/react";

type ItemType = z.infer<typeof itemSchema>;

const SpendTracker = () => {
  const [items, setItems] = useState<ItemType[]>([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);

  const form = useForm<ItemType>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      itemname: "",
      quantity: undefined,
      price: undefined,
      unit: "kg",
    },
  });

  const onSubmit = async (values: ItemType) => {
    try {
      const response = await axios.post("/api/additem", values);
      setItems((prevItems) => [...prevItems, values]);
      form.reset();
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
                  <Input placeholder="Item Name" {...field}></Input>
                </FormControl>
                <FormDescription>This is item name.</FormDescription>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                  <Input type="number" placeholder="Price" {...field}></Input>
                </FormControl>
                <FormDescription>Enter the price of the item.</FormDescription>
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
