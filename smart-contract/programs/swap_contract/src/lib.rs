

use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::system_instruction;
use anchor_spl::token::{self, Token, TokenAccount, Transfer as SplTransfer};
use solana_program::native_token::LAMPORTS_PER_SOL;
declare_id!("C8F3WqAioE5rMZJS5enC6fT4iQVorwxZhN77AgWcWraM");

const RADIO: u64 = 10;
#[program]
pub mod swap_contract {

    use super::*;

    pub fn create(ctx: Context<Create>) -> ProgramResult {
        Ok(())
    }

    pub fn swap_to_sol(ctx: Context<Swap>, amount: u64) ->ProgramResult{

       // transfer SPL
        let cpi_accounts = SplTransfer {
            from: ctx.accounts.from_ata.to_account_info(),
            to: ctx.accounts.to_ata.to_account_info(),
            authority: ctx.accounts.from.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx= CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(  cpi_ctx,  amount *LAMPORTS_PER_SOL)?;

        

        // let transfer_instruction = spl_token::instruction::transfer(
        //     &ctx.accounts.token_program.to_account_info().key(),
        //     &ctx.accounts.from_ata.to_account_info().key(),
        //     &ctx.accounts.to_ata.to_account_info().key(),
        //     &ctx.accounts.fund.to_account_info().key(),
        //     &[],
        //     amount *LAMPORTS_PER_SOL,
        // )?;
        
        // let required_accounts_for_transfer = [
        //     ctx.accounts.from_ata.to_account_info().clone(),
        //     ctx.accounts.to_ata.to_account_info().clone(),
        //     ctx.accounts.from.to_account_info().clone(),
        // ];
        // anchor_lang::solana_program::program::invoke(
        //     &transfer_instruction,
        //     // &required_accounts_for_transfer,
        //     &[
        //         // &[b"FUND_TOKEN"]
        //         ctx.accounts.from_ata.to_account_info(), 
        //         ctx.accounts.to_ata.to_account_info(),
        //         ctx.accounts.from.to_account_info()
        //     ]
        // )?;
        // transfer SOL
        let fund: &mut Account<'_, Fund>= &mut ctx.accounts.fund;
        let user: &mut Signer<'_> = &mut ctx.accounts.user;
        let rent_balance = Rent::get()?.minimum_balance(fund.to_account_info().data_len());
        if ** fund.to_account_info().lamports.borrow() -rent_balance <amount *LAMPORTS_PER_SOL/RADIO  {
            return Err(ProgramError::InsufficientFunds);
        }
  
        **fund.to_account_info().try_borrow_mut_lamports()?-=amount *LAMPORTS_PER_SOL/RADIO ;
        **user.to_account_info().try_borrow_mut_lamports()?+=amount *LAMPORTS_PER_SOL/RADIO ;

        Ok(())
    }
    pub fn swap_to_spl(ctx: Context<Swap>, amount: u64) -> ProgramResult {

        // transfer SOL
        let transfer_instruction = system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.fund.key(),
            amount * LAMPORTS_PER_SOL ,
        );
        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.user.to_account_info(), 
                ctx.accounts.fund.to_account_info()
            ],
        )?;

       
        // transfer SPL
        let amount_spl_token =  amount *LAMPORTS_PER_SOL *RADIO ;
        let cpi_accounts = SplTransfer {
            from: ctx.accounts.from_ata.to_account_info(),
            to: ctx.accounts.to_ata.to_account_info(),
            authority: ctx.accounts.from.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx= CpiContext::new(cpi_program, cpi_accounts);

        token::transfer(cpi_ctx, amount_spl_token)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, 
        payer=user,
        space=64,
        seeds=[
            b"FUND_TOKEN".as_ref(), 
            user.key().as_ref(),
        ],
        bump
    )]
    pub fund: Account<'info, Fund>,
    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub fund: Account<'info, Fund>,
    #[account(mut)]
    pub user: Signer<'info>,

    pub from: Signer<'info>,
    #[account(mut)]
    pub from_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to_ata: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}
#[account]
pub struct Fund {}

#[derive(Accounts)]
pub struct TransferSpl<'info> {
    pub from: Signer<'info>,
    #[account(mut)]
    pub from_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to_ata: Account<'info,TokenAccount>,
    pub token_program: Program<'info, Token>,
}
