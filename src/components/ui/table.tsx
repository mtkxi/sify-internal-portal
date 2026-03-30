"use client";

import * as React from "react";

import { cn } from "./utils";
import { filterFigmaProps } from "./figma-props-filter";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  const cleanProps = filterFigmaProps(props);
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...cleanProps}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  const cleanProps = filterFigmaProps(props);
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...cleanProps}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  const cleanProps = filterFigmaProps(props);
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...cleanProps}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  const cleanProps = filterFigmaProps(props);
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...cleanProps}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  const cleanProps = filterFigmaProps(props);
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...cleanProps}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  const cleanProps = filterFigmaProps(props);
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...cleanProps}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  const cleanProps = filterFigmaProps(props);
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...cleanProps}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  const cleanProps = filterFigmaProps(props);
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...cleanProps}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};