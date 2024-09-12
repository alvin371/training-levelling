"use client";

import { Route, route } from "@/commons/routes";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionTable, DataTable, Page } from "admiral";
import { Button, Modal, Tag } from "antd";
import { ColumnType } from "antd/es/table";
import { useFilter } from "@/utils/table-filter";
import RowActionButtons from "admiral/table/row-action-button";
import { useDeleteBorrowing, useGetListBorrowing } from "./_hooks";
import { TBorrowing } from "./_modules/type";
import { filterSort } from "./_components/filter";

const BorrowingClient = () => {
  const { implementDataTable, setFilter, filter } = useFilter();

  const { isPending, handleSubmit } = useDeleteBorrowing();
  const { data, isLoading } = useGetListBorrowing(filter);

  const columns: ColumnType<TBorrowing>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "Book ID",
      dataIndex: "book_id",
      key: "book_id",
    },
    {
      title: "Borrowed Date",
      dataIndex: "borrowed_date",
      key: "borrowed_date",
    },
    {
      title: "Return Date",
      dataIndex: "return_date",
      key: "return_date",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => {
        return value === "Borrowed" ? (
          <Tag color="yellow">{value}</Tag>
        ) : (
          <Tag color="green">{value}</Tag>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (value, record) => {
        const recordId = record?.id?.toString();
        return (
          <RowActionButtons
            actions={[
              {
                type: "view",
                title: "Detail Borrowings",
                href: `${Route.BORROWING}/${record.id}`,
              },
              {
                type: "edit",
                title: "Edit Borrowings",
                href: route(Route.BORROWING_DETAIL, { id: recordId! }),
              },
              {
                type: "delete",
                title: "Delete Borrowings",
                onClick: () => {
                  Modal.confirm({
                    title: "Delete Borrowings",
                    okType: "danger",
                    content:
                      "Data that has been deleted cannot be restored. Are you sure you want to delete this borrowing item?",
                    icon: <DeleteOutlined />,
                    onOk: () => handleSubmit(recordId!),
                    okButtonProps: {
                      loading: isPending,
                    },
                  });
                },
              },
            ]}
          />
        );
      },
    },
  ];
  return (
    <Page
      title="List Borrowing"
      topActions={
        <>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            href={Route.BORROWING_CREATE}
          >
            Create Borrowing
          </Button>
        </>
      }
      breadcrumbs={[
        { label: "Dashboard", path: Route.DASHBOARD },
        { label: "Borrowing", path: Route.BORROWING },
      ]}
      noStyle
      contentStyle={{ paddingTop: 20 }}
    >
      <ActionTable
        onSearch={(value) => setFilter({ search: value })}
        searchValue={filter.search}
        onFiltersChange={(values) => setFilter(values)}
        filters={[
          filterSort({
            options: [
              { label: "ID", value: "id" },
              { label: "Name", value: "name" },
              { label: "Birthdate", value: "birthdate" },
            ],
            searchParams: filter,
          }),
        ]}
      />
      <div
        style={{
          backgroundColor: "white",
          padding: "5px",
          marginTop: "10px",
        }}
      >
        <DataTable
          columns={columns}
          hideSearch
          source={{
            data: data?.data,
            meta: {
              total: data?.meta.total || 0,
              pageSize: data?.meta.per_page || 10,
              current: data?.meta.current_page || 1, // Correct field name for the current page
            },
          }}
          loading={isLoading}
          onChange={implementDataTable}
          search={filter.search}
        />
      </div>
    </Page>
  );
};

export default BorrowingClient;
