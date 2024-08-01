// main menu
export const pages = [
    { label: "Start",border: true },    
    { label: "Basic" },
    { label: "Advanced",border: true },    
    { label: "Contacts" },
    /* { label: "Groups" },
    { label: "Projects" }, */
    { label: "History" },
    { label: "Settings" }
]

// account menu
export const actions = [
    { label: "Account Info", action: "info",custom:true },    
    { label: "Rename Account", action: "rename",custom:false},
    { label: "Change Password", action: "changePassword",custom:false},   
    { label: "Create New Account", action: "create",custom:true,border:true },
    { label: "Backup Account", action: "backup",custom:true },    
    { label: "Restore Account", action: "restore",custom:true,border:true },    
    { label: "Delete Account", action: "delete",custom:false }
]