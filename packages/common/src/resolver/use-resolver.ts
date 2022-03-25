export const useTransactionalResolver =
  <I, O>([useCase, input]: [UseCase<I, O, ResolverReader<I, O>>, I]) =>
  (ctx: Context.Context) => F.pipe(
    lookups(
      CommonDITokens.Transaction,
      useCase.token
    )(ctx),
    O.map(([tr,resolver]) => F.pipe(
      tr.createSession(),
      TE.chain((newTr) => {
        const newCtx:Context.Context = F.flow(
          Context.register(Context.bindTo(CommonDITokens.Transaction)(() => newTr)),
          Context.register(Context.bindTo(CommonDITokens.DB)(()=>DB.of(newTr)))
        )(ctx);
        return newTr.start((session) =>
          F.pipe(
            resolver(newCtx).resolve(input),
            TE.map(
              (v) =>
              ({
                output: v,
                token: useCase.token,
                _as: 'UseResolverOutPut',
              } as UseResolverOutput<O>)
            )
          )
        )
      }),
    )),
    O.getOrElse(() =>
      TE.left(
        new NotFoundDependencyError({
          message: useCase.token.name,
        })
      )
    )
  )

export const useResolver =
  <I, O>([useCase, input]: [UseCase<I, O, ResolverReader<I, O>>, I]) =>
  (ctx: Context.Context) => {
    return F.pipe(
      lookup(ctx)(useCase.token),
      O.map((v) =>
        F.pipe(
          v(ctx).resolve(input),
          TE.map(
            (v) =>
              ({
                output: v,
                token: useCase.token,
                _as: 'UseResolverOutPut',
              } as UseResolverOutput<O>)
          )
        )
      ),
      O.getOrElse(() =>
        TE.left(
          new NotFoundDependencyError({
            message: useCase.token.name,
          })
        )
      )
    );
  };