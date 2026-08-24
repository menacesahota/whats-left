"use client";

import { useState } from "react";
import { EmailCta } from "@/components/EmailCta";
import { NumberField } from "@/components/fields";
import {
  EmptyResult,
  ResultPanel,
  ResultRow,
} from "@/components/ResultPanel";
import { ToolShell } from "@/components/ToolShell";
import { cardClass } from "@/components/ui";
import { SITE_NAME } from "@/lib/brand";
import { formatGBP, parseAmount, toNumber } from "@/lib/money";
import { calculateMortgage } from "@/lib/mortgage";

function validAmount(raw: string, allowEmpty = true): boolean {
  if (raw.trim() === "") return allowEmpty;
  const n = parseAmount(raw);
  return n !== null && Number.isFinite(n) && n >= 0;
}

export function RentOrBuyTool() {
  const [rent, setRent] = useState("");
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("10");
  const [rate, setRate] = useState("4.5");
  const [term, setTerm] = useState("30");
  const [extra, setExtra] = useState("");

  function loadDemo() {
    setRent("1200");
    setPrice("280000");
    setDeposit("10");
    setRate("4.5");
    setTerm("30");
    setExtra("150");
  }

  const errors = {
    rent:
      rent.trim() !== "" && !validAmount(rent, false)
        ? "Rent must be £0 or more."
        : undefined,
    price:
      price.trim() !== "" && !validAmount(price, false)
        ? "Price must be £0 or more."
        : undefined,
    deposit:
      deposit.trim() !== "" &&
      (!validAmount(deposit, false) || toNumber(deposit) > 100)
        ? "Deposit must be between 0 and 100."
        : undefined,
    rate:
      rate.trim() !== "" &&
      (!validAmount(rate, false) || toNumber(rate) > 100)
        ? "Rate must be between 0 and 100."
        : undefined,
    term:
      term.trim() !== "" &&
      (!validAmount(term, false) || toNumber(term) < 1 || toNumber(term) > 40)
        ? "Term must be between 1 and 40 years."
        : undefined,
    extra:
      extra.trim() !== "" && !validAmount(extra, false)
        ? "Extra costs must be £0 or more."
        : undefined,
  };

  const ready =
    validAmount(rent, false) &&
    validAmount(price, false) &&
    validAmount(deposit, false) &&
    validAmount(rate, false) &&
    validAmount(term, false) &&
    toNumber(term) >= 1 &&
    toNumber(term) <= 40 &&
    toNumber(deposit) <= 100 &&
    toNumber(rate) <= 100 &&
    !errors.extra;

  const mortgage = ready
    ? calculateMortgage({
        housePrice: toNumber(price),
        depositPercent: toNumber(deposit),
        annualRatePercent: toNumber(rate),
        termYears: toNumber(term),
      })
    : null;
  const extraN = toNumber(extra);
  const owning = mortgage ? mortgage.monthlyRepayment + extraN : null;
  const rentN = toNumber(rent);

  const emailBody =
    mortgage && owning !== null
      ? [
          `${SITE_NAME} rent vs buy sniff test`,
          `Monthly rent: ${formatGBP(rentN)}`,
          `House price: ${formatGBP(toNumber(price))}`,
          `Cash needed for deposit: ${formatGBP(mortgage.deposit)}`,
          `Monthly mortgage repayment: ${formatGBP(mortgage.monthlyRepayment)}`,
          `Owning (repayment + extra bills): ${formatGBP(owning)} / month`,
          "",
          "Sniff test only. Not a mortgage offer. Not financial advice.",
        ].join("\n")
      : "";

  return (
    <ToolShell
      title="Rent or buy"
      description="A sniff test: monthly rent versus a standard repayment mortgage. Not a mortgage offer, and it ignores stamp duty, fees and maintenance."
      onDemo={loadDemo}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          className={`${cardClass} space-y-5`}
          onSubmit={(e) => e.preventDefault()}
        >
          <NumberField
            id="rent"
            label="Monthly rent"
            prefix="£"
            value={rent}
            onChange={setRent}
            error={errors.rent}
          />
          <NumberField
            id="price"
            label="House price"
            prefix="£"
            value={price}
            onChange={setPrice}
            error={errors.price}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <NumberField
              id="deposit"
              label="Deposit"
              suffix="%"
              value={deposit}
              onChange={setDeposit}
              error={errors.deposit}
              max={100}
              step="0.1"
            />
            <NumberField
              id="rate"
              label="Mortgage rate"
              suffix="%"
              value={rate}
              onChange={setRate}
              error={errors.rate}
              max={100}
              step="0.01"
            />
            <NumberField
              id="term"
              label="Term"
              suffix="years"
              value={term}
              onChange={setTerm}
              error={errors.term}
              min={1}
              max={40}
              step="1"
            />
          </div>
          <NumberField
            id="extra"
            label="Extra monthly owning costs"
            prefix="£"
            value={extra}
            onChange={setExtra}
            hint="Optional. Service charge, ground rent, or higher bills."
            error={errors.extra}
          />
        </form>

        <ResultPanel>
          {mortgage && owning !== null ? (
            <>
              <p className="mb-4 rounded-md bg-background px-3 py-2 text-sm text-muted">
                Sniff test only. Not a mortgage offer. We do not include stamp
                duty, solicitor fees, maintenance or rate changes.
              </p>
              <dl>
                <ResultRow
                  label="Cash needed for deposit"
                  value={formatGBP(mortgage.deposit)}
                />
                <ResultRow
                  label="Monthly mortgage repayment"
                  value={formatGBP(mortgage.monthlyRepayment)}
                />
                <ResultRow
                  label="Rent costs"
                  value={`${formatGBP(rentN)} / month`}
                />
                <ResultRow
                  label="Owning costs"
                  value={`${formatGBP(owning)} / month`}
                  emphasise
                />
              </dl>
              <p className="mt-3 text-sm text-muted">
                Owning figure is repayment plus the extra bills you entered,
                before maintenance.
              </p>
            </>
          ) : (
            <EmptyResult message="Enter rent and a house price, or try the demo numbers." />
          )}
        </ResultPanel>
      </div>
      <EmailCta
        subject={`${SITE_NAME} rent vs buy sniff test`}
        body={emailBody}
        disabled={!mortgage}
      />
    </ToolShell>
  );
}
