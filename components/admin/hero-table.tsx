"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "./table-skeleton";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  ListFilter,
  Search, // Added Search icon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Utility function to get nested property
const getNestedProperty = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

interface HeroTableProps {
  columns: {
    header: string;
    accessor: string;
    cell?: (item: any) => React.ReactNode;
  }[];
  data: any[];
  loading: boolean;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  title: string;
  createButtonText: string;
  createButtonAction: () => void;
  search: string;
  setSearch: (search: string) => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  sort: { column: string; direction: "asc" | "desc" } | null;
  setSort: (sort: { column: string; direction: "asc" | "desc" } | null) => void;
}

const HeroTable = ({
  columns,
  data,
  loading,
  onEdit,
  onDelete,
  title,
  createButtonText,
  createButtonAction,
  search,
  setSearch,
  page,
  setPage,
  totalPages,
  sort,
  setSort,
}: HeroTableProps) => {
  const handleSort = (column: string) => {
    if (sort && sort.column === column) {
      setSort({
        column,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSort({ column, direction: "asc" });
    }
  };

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="p-4 bg-background text-foreground rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex justify-end items-center space-x-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              <ListFilter className="w-4 h-4 mr-2" />
              Sort By: {sort ? `${sort.column} ${sort.direction}` : "None"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((col) => (
              <DropdownMenuItem
                key={col.accessor}
                onClick={() => handleSort(col.accessor)}
              >
                {col.header}
                {sort && sort.column === col.accessor && (
                  <span className="ml-2">
                    {sort.direction === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={createButtonAction}>{createButtonText}</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.accessor}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  {col.header}
                </div>
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((col) => (
                <TableCell key={col.accessor}>
                  {col.cell
                    ? col.cell(item)
                    : getNestedProperty(item, col.accessor)}
                </TableCell>
              ))}
              <TableCell className="flex gap-2">
                {/* Edit Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white border-none shadow-sm transition-colors"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </Button>

                {/* Delete Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white border-none shadow-sm transition-colors"
                  onClick={() => onDelete(item)}
                >
                  Delete
                </Button>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-2">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            <span className="mr-2">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroTable;