import Link from 'next/link';
import { ChevronRight, Home, Folder } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface CategoryBreadcrumbProps {
  categoryName: string;
}

export function CategoryBreadcrumb({ categoryName }: CategoryBreadcrumbProps) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator>
          <ChevronRight className="w-4 h-4" />
        </BreadcrumbSeparator>
        
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/categories" className="flex items-center gap-1">
              <Folder className="w-4 h-4" />
              Categories
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator>
          <ChevronRight className="w-4 h-4" />
        </BreadcrumbSeparator>
        
        <BreadcrumbItem>
          <BreadcrumbPage className="max-w-[200px] truncate">
            {categoryName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}