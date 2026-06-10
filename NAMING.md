# NAMING.md — `@josh-gao/icon-library` 命名规范

> **状态：已确认采用全 SF Symbols 命名规则。**
> 本文件既是图标库 **2.0.0** 的执行蓝图，也是**日后新增图标的命名手册**。
> **范围（重要）**：本轮命名升级**只针对 `@josh-gao/icon-library` 自身**。FinFlow（`@finflow/icons`）的双包收敛**已搁置、与本规范解耦**，不在本轮。

---

## 0. 心智模型（先消除最容易踩的误解）

在读规则之前，把这几条钉死，否则后面会反复困惑：

- **扁平**：每个名字 = 一个独立 SVG 文件 = `icons.json` 里平铺的一个 key。
- **后缀不是变体**：`chevron.left.fill` 与 `chevron.left` 是**两个互不相关的独立图标**，前者不是后者的"演化版"。系统**绝不**把它解析成"同一本体的填充变体"——变体的概念在上一次扁平化时就已经取消了。
- **"基名 / 后缀"是给人看的命名语言，不是系统概念**。运行时组件 (`Icon.native.tsx` / `Icon.web.tsx`) 把 key 当 **opaque 字符串**，`icons[name]` 一次查表，**从不切分点、不理解点的含义**。
- **点的唯一功能性作用**：让构建期的 `verify` 脚本能把名字拆成"段"来**校验后缀拼写与顺序**。因为基名用拼接（无点）、点专职后缀，两者分工清晰，verify 才能干净地工作。除此之外，点 vs 其他分隔符对运行时**零影响**。
> 一句话：你选的是一套**起名风格**，不是引入了新的解析机制。

---

## 1. 本轮定位与代价

- **目标**：把 `@josh-gao/icon-library` 的命名统一为 SF Symbols 风格（基名拼接 + 点后缀），并把规则沉淀成可校验、可参考的规范。
- **性质**：改名让现有 key 失效 → **破坏性变更 → 2.0.0**（当前已发布 1.0.0）。
- **消费方影响（小且可控）**：唯一已知消费方 `heroui-demo` 用 `^1.0.0` 锁依赖，**不会自动升到 2.0.0**——所以它在你显式升级前完全不受影响。等你某天把它升到 2.0.0 时，只需更新少量被改名的调用点（`chevron-left` → `chevron.left` 等）。
- **不捆绑收敛**：FinFlow `@finflow/icons` 的并入是独立议题，已搁置。本轮干净地只做 library 自身的命名升级。

---

## 2. 两条核心命名规则

SF Symbols 对名字的两类组成部分**区别对待**，这是整套规范的根基。

### 规则 A — 复合名词：拼接，不加任何分隔符
多个词共同构成**一个名词概念**时，拼成一个全小写单词。
- `credit-card` → **`creditcard`**（**不是** `credit.card`）
- 参照 SF Symbols 真实命名：`creditcard`、`paperplane`、`archivebox`、`externaldrive` 都这么拼。

### 规则 B — 结构性修饰：用点 `.` 连接
某段是对基名的**结构性修饰**（方向 / 外框 / 否定 / 填充 / 徽标）时，用点连接。
- `chevron-left` → **`chevron.left`**（`left` 是方向修饰）
- `arrow` + 向上 + 圆框 + 实心 → `arrow.up.circle.fill`

### 判定要诀（每个多词图标必过这一关）
> **第二个词是「名词的一部分」还是「对基名的修饰」？**
> 名词组成部分 → 拼接（A）；方向/外框/状态修饰 → 点（B）。

经典对照：**`creditcard`**（card 是名词的一部分）vs **`chevron.left`**（left 是方向修饰）。两者表面都是"两个词"，归宿相反——**这个判断没有机械规则，必须逐个人工裁决。**

---

## 3. SF Symbols 命名规则参考（日后命名手册）

> 以下规则基于真实 SF Symbols 符号名归纳。本库**只借用其语法规则，不引入 Apple 的图标词汇**（你的图标源是自有设计资源）。词汇清单为常用集合、非穷举。

### 3.1 名字的整体结构
```
base[.count][.direction][.enclosure][.negation][.fill][.badge.X]
```
基名在最左；其后是按固定槽位排列的结构性后缀。

### 3.2 基名：复合名词拼接
- 一个名词概念 → 全小写拼接：`creditcard`、`paperplane`、`archivebox`、`arrowshape`。
- 反例（不拼接，因为第二段是修饰而非名词）：`chevron.left`、`arrow.up`。

### 3.3 后缀槽位与规范顺序

| 顺序 | 槽位 | 含义 | 本库现状 | 常用 token（非穷举） |
|---|---|---|---|---|
| 1 | count | 数量 | 未用 | `2` `3` |
| 2 | direction | 方向 | 用（chevron） | `up` `down` `left` `right` `forward` `backward`；可组合 `up.left` `down.right` |
| 3 | enclosure | 外框 | 预留 | `circle` `square` `rectangle` `app` `diamond` `shield` `seal` `hexagon` `octagon` |
| 4 | negation | 否定/关闭 | 预留 | `slash` |
| 5 | fill | 实心 | 用 | `fill` |
| 6 | badge | 徽标 | 预留 | `badge.plus` `badge.minus` `badge.checkmark` `badge.xmark` `badge.questionmark` `badge.ellipsis` |

补充约定：
- **方向组合顺序**：纵向在前、横向在后——`arrow.up.left`（不是 `left.up`）。
- **count / and**：少见。计数如 `square.2`；组合符号用 `and` 连接，如 `arrow.up.and.down`。本库暂不涉及。

### 3.4 拆解示例（读懂结构）
| 完整名 | 拆解 |
|---|---|
| `chevron.left` | `chevron`(基) · `left`(方向) |
| `creditcard.fill` | `creditcard`(基·拼接) · `fill`(填充) |
| `arrow.up.circle.fill` | `arrow`(基) · `up`(方向) · `circle`(外框) · `fill`(填充) |
| `trash.slash.fill` | `trash`(基) · `slash`(否定) · `fill`(填充) |
| `folder.fill.badge.plus` | `folder`(基) · `fill`(填充) · `badge.plus`(徽标) |

### 3.5 三条采用纪律（务必遵守）
1. **借语法不借词汇**：用上面的**排列规则**，不照搬 Apple 的图标名（如 SF Symbols 里"用户"叫 `person`，本库继续叫 `user`）。
2. **每个后缀变体 = 一个独立 SVG 资产，不是程序变换**：`chevron.left` 和 `chevron.right` 是**两个设计文件**，不是把 `chevron` 旋转；`.fill` 是另一张实心设计稿，不是给线性图标自动填充。
3. **用到才登记**：只有当某 token 对应一个你**真有的**图标资产时，才让它出现在名字里、并加进 `SUFFIX_REGISTRY`。不要预先把整套 Apple 词汇塞进来。

### 3.6 fill ↔ badge 顺序的统一裁定
SF Symbols 自身在此不一致：`folder.fill.badge.plus`（fill 在前）vs `bell.badge.fill` / `app.badge.fill`（fill 在后）。
**本库统一规定：`fill` 在 `badge` 之前**，由 verify 强制——比 Apple 更自洽。

---

## 4. 本库 11 个基名的逐个改名结果

把当前 11 个基名套用规则 A/B 的结果（`.fill` 变体随基名同步）：

| 当前 key | 新基名 | 规则 | 理由 | 变化 |
|---|---|---|---|---|
| `bank` | `bank` | — | 单词 | 否 |
| `bell` | `bell` | — | 单词 | 否 |
| `chevron-left` | `chevron.left` | B | `left` = 方向修饰 → 点 | **是** |
| `chevron-right` | `chevron.right` | B | `right` = 方向修饰 → 点 | **是** |
| `copy` | `copy` | — | 单词 | 否 |
| `credit-card` | `creditcard` | A | 复合名词 → 拼接（**非** `credit.card`） | **是** |
| `gift` | `gift` | — | 单词 | 否 |
| `home` | `home` | — | 单词 | 否 |
| `lock` | `lock` | — | 单词 | 否 |
| `shield` | `shield` | — | 单词 | 否 |
| `user` | `user` | — | 单词 | 否 |

**实际改动只有 3 个基名**（chevron-left、chevron-right、credit-card），连同 `.fill` 共 **6 个 key 改名**，其余 16 个不变：
```
chevron-left        → chevron.left
chevron-left.fill   → chevron.left.fill
chevron-right       → chevron.right
chevron-right.fill  → chevron.right.fill
credit-card         → creditcard
credit-card.fill    → creditcard.fill
```
> 价值不在"这次改 6 个"，而在**确立规则**：以后每加图标都按 §2/§3 裁决，名字体系长期一致。

---

## 5. 解析与校验（点专职后缀 → 仍然简单）

**关键认知：基名拼接（永远单段无点）+ 点专职后缀，使 `split('.')` 第一段永远是基名、其余全是后缀链。** 不需要"右往左剥离 + 主字典"那套重型方案——registry 的职责是**校验后缀合法性与顺序**，不是猜基名边界。

- `creditcard.fill` → 基名 `creditcard`，后缀 `[fill]`
- `chevron.left.fill` → 基名 `chevron`，后缀 `[left, fill]`

**运行时组件完全不变**：依旧 `icons[name]` 一次查表，key 当 opaque 字符串。下面的 registry 与解析**只用于构建期 / verify，不打进发布物、不参与运行时**。

### 5.1 Registry（verify-only）
```ts
// scripts/suffix-registry.ts —— 仅 verify/build 使用，不随包发布
export type SuffixSlot = 'count' | 'direction' | 'enclosure' | 'negation' | 'fill' | 'badge';
export interface SuffixDef { slot: SuffixSlot; order: number; } // order 越小越靠近基名

// 「哪些点段是合法后缀」的唯一真相。只有真有对应图标资产时才加 token。
export const SUFFIX_REGISTRY: Record<string, SuffixDef> = {
  // direction —— order 2
  up:    { slot: 'direction', order: 2 },
  down:  { slot: 'direction', order: 2 },
  left:  { slot: 'direction', order: 2 },
  right: { slot: 'direction', order: 2 },
  // enclosure —— order 3（预留，本批未用）
  circle: { slot: 'enclosure', order: 3 },
  square: { slot: 'enclosure', order: 3 },
  // negation —— order 4（预留）
  slash: { slot: 'negation', order: 4 },
  // fill —— order 5
  fill:  { slot: 'fill', order: 5 },
};
```

### 5.2 解析 + 校验（verify-only）
```ts
export interface ParsedName { base: string; suffixes: string[]; }

// 基名 = 最左段；其后每段都必须是已注册后缀。
export function parseIconName(key: string): ParsedName {
  const seg = key.split('.');
  return { base: seg[0], suffixes: seg.slice(1) };
}

export function validateIconName(key: string): string[] {
  const errs: string[] = [];
  const { base, suffixes } = parseIconName(key);

  // 基名卫生：全小写、无连字符（复合名词必须拼接 → 自动逮住未迁移的 credit-card）
  if (base.includes('-')) errs.push(`base "${base}" 含连字符；复合名词须拼接（如 creditcard）`);
  if (base !== base.toLowerCase()) errs.push(`base "${base}" 必须全小写`);

  // 每个后缀必须已注册，且按规范顺序非递减（同槽位可相邻，如多方向 up.left）
  let last = 0;
  for (const s of suffixes) {
    const def = SUFFIX_REGISTRY[s];
    if (!def) { errs.push(`未知后缀 ".${s}"（${key}）：要么注册它，要么改名`); continue; }
    if (def.order < last) errs.push(`后缀 ".${s}" 顺序错误（${key}）：应为 direction→enclosure→slash→fill`);
    last = def.order;
  }
  return errs;
}
```

---

## 6. verify.ts 升级点

把当前那条"后缀 token 只能在白名单 `{fill}`"替换为：
1. 对每个 key 跑 `validateIconName`，聚合错误。
2. **基名连字符检查**——自动逮住任何还没迁移的 `credit-card` 之类。
3. 保留孤儿检查：存在 `x.fill` 但无基名 `x` → warn。
4. 保留：path type ∈ {stroke, fill}；even-odd 的 fill path 必须有 fillRule；无 transform 残留。
5. 保留：`keyof typeof iconsData` 成员集 === `Object.keys(icons)`。

---

## 7. 2.0.0 执行清单（library-only）

> 本轮只动 `@josh-gao/icon-library`。准备好就可执行；消费方 heroui-demo 因 `^1.0.0` 不会被自动带上，按需再升。

1. **重命名 raw SVG（6 个文件）**：
   ```
   chevron-left.svg       → chevron.left.svg
   chevron-left.fill.svg  → chevron.left.fill.svg
   chevron-right.svg      → chevron.right.svg
   chevron-right.fill.svg → chevron.right.fill.svg
   credit-card.svg        → creditcard.svg
   credit-card.fill.svg   → creditcard.fill.svg
   ```
2. 重新 build → `icons.json` 的 key 自动更新；`IconName`（`keyof typeof iconsData`）自动跟随。
3. 新增 `scripts/suffix-registry.ts`，按 §5/§6 升级 `verify.ts`，跑通全绿。
4. `package.json` 版本 → **2.0.0**，`npm pack --dry-run` 预检后手动 `npm publish`。
5. README / AGENTS.md 同步新命名约定，指向本文件。
6. （可选、独立）将 heroui-demo 升到 2.0.0，更新被改名的调用点（`chevron-left`→`chevron.left`、`credit-card`→`creditcard`）。不升则维持 1.0.0、不受影响。

> **已搁置（不在本轮）**：FinFlow `@finflow/icons` 的双包收敛。日后若重启，届时把其图标按 §2/§3 定名后并入。

---

## 8. 新增图标时的命名流程（实操手册）

每加一个图标，按此流程定名：

1. **核心概念是什么？** → 写出基名候选。
2. **基名是多词吗？**
   - 多词构成一个名词 → 全小写拼接（`creditcard`）。
   - 含方向/外框/状态修饰 → 那部分不是基名，是后缀（见 4）。
3. **它是某个图标的结构性变体吗（实心/带圈/带斜杠/方向）？**
   - 是 → 用对应后缀，按 §3.3 槽位顺序拼接；若该 token 未登记，先加进 `SUFFIX_REGISTRY`。
   - 不是（全新独立概念）→ 就一个基名。
4. **文件名 = 最终 key**，放进 `raw/`，build 出 key。
5. **跑 verify**：确认名字合法、后缀顺序对、无孤儿、无重复。

---

## 9. 决策记录（为什么这么定）

- **复合名词拼接而非点**：点基名会引入"基名边界靠字典消歧"的复杂度；拼接让基名永远单段、`split('.')` 即可解析。也与 SF Symbols 自身一致（`creditcard` 非 `credit.card`）。
- **点专职后缀、registry 只用于 verify**：运行时把 key 当 opaque 字符串、零解析；命名纪律由构建期校验保证。
- **本轮只做 library、收敛搁置**：FinFlow 解耦，避免把无关议题捆进破坏性变更；消费方 `^1.0.0` 不受 2.0.0 影响。
- **借语法不借词汇**：图标源是自有设计资源，只采用 SF Symbols 的命名**语法**，不引入 Apple 的图标词汇与那本主字典。
