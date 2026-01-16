"use server";
import countries from "@/data/countries.json";
import { pool } from "@/lib/config/db";
import { RowDataPacket } from "mysql2";

export async function seedCountries() {
  try {
    for (const country of countries) {
      const [query] = await pool.query<RowDataPacket[]>(
        "SELECT code FROM countries WHERE code = ?",
        [country.code]
      );
      if (query.length < 1) {
        await pool.query("INSERT INTO countries (name, code) VALUES (?, ?)", [
          country.name,
          country.code,
        ]);
      }
    }
    console.log("Finish");
  } catch (error) {
    console.log("Error seeding countries ", error);
  }
}
