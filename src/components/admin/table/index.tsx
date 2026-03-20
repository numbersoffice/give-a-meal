"use client";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

export default function Table({ children }: { children: React.ReactNode }) {
  return <table className={styles.table}>{children}</table>;
}

export function TableHead({ columns }: { columns: string[] }) {
  return (
    <thead>
      <tr>
        {columns.map((title) => (
          <th key={title}>{title}</th>
        ))}
      </tr>
    </thead>
  );
}

export function TableRow({
  columns,
  urlData,
  isLoading,
}: {
  columns: string[];
  urlData?: { href: string; params?: {} };
  isLoading?: boolean;
}) {
  const router = useRouter();

  return (
    <tbody>
      {!isLoading ? (
        <tr
          className={urlData ? styles.hover : undefined}
          onClick={() => urlData && router.push(urlData.href)}
        >
          {columns.map((col) => (
            <td key={col}>{col}</td>
          ))}
        </tr>
      ) : (
        <tr />
      )}
    </tbody>
  );
}

export function TableRowLoading({
  numberOfColumns,
}: {
  numberOfColumns: number;
}) {
  return (
    <tbody className={styles.tableRowLoading}>
      <tr>
        {Array.from(Array(numberOfColumns)).map((_, index) => (
          <td key={index} />
        ))}
      </tr>
    </tbody>
  );
}
