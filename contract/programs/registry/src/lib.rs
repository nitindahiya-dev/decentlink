use anchor_lang::prelude::*;

declare_id!("Etr537JjVtMhC6YNj6k2sFd22iCYrVNwnnjif4hXjfTJ");

#[program]
pub mod registry {
  use super::*;
  pub fn register(ctx: Context<Register>, short: [u8;6], cid: Vec<u8>) -> Result<()> {
    let entry = &mut ctx.accounts.entry;
    entry.short = short;
    entry.cid = cid;
    Ok(())
  }
}

#[account]
pub struct Entry {
  pub short: [u8;6],
  pub cid: Vec<u8>,
}

#[derive(Accounts)]
pub struct Register<'info> {
  #[account(init, payer = authority, space = 8 + 6 + 4 + 64)]
  pub entry: Account<'info, Entry>,
  #[account(mut)]
  pub authority: Signer<'info>,
  pub system_program: Program<'info, System>,
}
