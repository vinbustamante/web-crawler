export const DatabaseEnum = {
  Tables: {
    Domain: {
      name: "domain",
      Fields: {
        DomainId: "domain_id",
        Name: "name",
        CreatedDate: "created_date",
      },
    },
    Link: {
      name: "link",
      Fields: {
        LinkId: "link_id",
        DomainId: "domain_id",
        Url: "url",
        IsProcessed: "is_processed",
        IsLocked: "is_locked",
        LockedDate: "lock_date",
      },
    },
  },
};
