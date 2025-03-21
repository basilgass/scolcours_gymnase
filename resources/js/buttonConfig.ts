/**
 * buttonConfig contains the button configuration.
 */

export type buttonTypes =
    "active" |
    "admin" |
    "add" |
	"cancel" |
	"danger" |
    "default" |
    "delete" |
    "edit" |
    "primary" |
	"save" |
	"success"

export const buttonConfig: Record<buttonTypes, { label: string, icon: string, outline: string, fill: string }> = {
    "active": {
        label: "Activer",
        icon: "bi bi-check2",
        outline: "btn-outline-active",
        fill: "btn-active"
    },
    "admin": {
        label: "Admin",
        icon: "bi bi-gear",
        outline: "btn-outline-admin",
        fill: "btn-admin"
    },
    "add": {
        label: "Ajouter",
        icon: "bi bi-plus-lg",
        outline: "btn-outline-edit",
        fill: "btn-edit"
    },
	"cancel": {
		label: "Annuler",
		icon: "bi bi-x-lg",
		outline: "btn-outline-cancel",
		fill: "btn-cancel"
	},
	"danger": {
		label: "Danger",
		icon: "bi bi-exclamation-triangle",
		outline: "btn-outline-danger",
		fill: "btn-danger",
	},
    "default": {
        label: "par défaut",
        icon: "",
        outline: "btn-outline-default",
        fill: "btn-default"
    },
    "delete": {
        label: "Supprimer",
        icon: "bi bi-trash",
        outline: "btn-outline-delete",
        fill: "btn-danger"
    },
    "edit": {
        label: "Modifier",
        icon: "bi bi-pencil",
        outline: "btn-outline-edit",
        fill: "btn-edit"
    },
    "primary": {
        label: "principal",
        icon: "",
        outline: "btn-outline-primary",
        fill: "btn-primary"
    },
    "save": {
        label: "Enregistrer",
        icon: "bi bi-save",
        outline: "btn-outline-primary",
        fill: "btn-primary"
    },
	"success": {
		label: "Succès",
		icon: "bi bi-hand-thumbs-up",
		outline: "btn-outline-success",
		fill: "btn-success"
	}
}
