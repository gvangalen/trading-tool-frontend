import { useModal } from "@/components/modal/ModalProvider";

export function openBotBudgetModal({ bot, onUpdateBudget }) {
  const { openConfirm, showSnackbar } = useModal();

  const {
    bot_id,
    bot_name,
    budget = {},
  } = bot;

  const form = {
    total_eur: budget.total_eur ?? 0,
    daily_limit_eur: budget.daily_limit_eur ?? 0,
    min_order_eur: budget.min_order_eur ?? 0,
    max_order_eur: budget.max_order_eur ?? 0,
  };

  openConfirm({
    title: `💰 Bot budget – ${bot_name}`,
    description: (/* exact dezelfde JSX als nu */),
    confirmText: "Opslaan",
    onConfirm: async () => {
      try {
        await onUpdateBudget(bot_id, form);
        showSnackbar("Bot budget bijgewerkt", "success");
      } catch {
        showSnackbar("Budget opslaan mislukt", "danger");
      }
    },
  });
}
