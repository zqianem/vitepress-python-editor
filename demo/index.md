# Demo

<script setup>
import Editor from 'vitepress-python-editor'
</script>

## Hello world

```python
name = input("What's your name? ")

if name:
    print(f"Hello {name}!")
else:
    print(f"Hello stranger!")
```
<Editor id="hello" />

## Tick tock

```python
import time

for i in range(6):
    if i % 2 == 0:
        print('tick')
    else:
        print('tock')
    time.sleep(1)
```
<Editor id="clock" />

## Infinite loop

```python
x = 0
while True:
    x = x + 1
    # print(x) # uncommenting this line makes "stop running" fail
```
<Editor id="loop" />

See https://github.com/pyodide/pyodide/discussions/4595 for details.

## A lot of code

```python
class PerfCounter:
    def __init__(self) -> None:
        self.start = time.perf_counter_ns()
        self.perf_data: list[str] = []

    @staticmethod
    def format_performance_for_print(name: str, endtime: int, starttime: int) -> str:
        return f"{' '*(23-len(name))}{name}   {round((endtime-starttime)/1_000_000, 5)}"

    def run(self, name: str, f, *args, **kwargs):
        starttime = time.perf_counter_ns()
        result = f(*args, **kwargs)
        endtime = time.perf_counter_ns()
        self.perf_data.append(PerfCounter.format_performance_for_print(name, endtime, starttime))
        return result

    def finish_and_print_report(self):
        end = time.perf_counter_ns()
        for line in self.perf_data:
            print(line)
        print(f"\nelapsed in {(end-self.start)/1_000_000} ms")


def run_python(filename: str):
    print(f"parsing '{filename}' using python grammar")
    perf_counter = PerfCounter()

    with open(filename, 'r') as f:
        source_code = f.read()
    source_code = python.Preprocessor.run(source_code)

    # PARSE GRAMMAR
    config = perf_counter.run("ConfigParsing",
        alpaca.config.parser.run,
        filename="./src/python/python.gm")

    # TOKENIZE
    tokens = perf_counter.run("Tokenizing",
        alpaca.lexer.run,
        text=source_code.strip(), config=config, callback=eisen.EisenCallback)
    # for t in tokens: print(t)

    ast = perf_counter.run("Parser",
        alpaca.parser.run,
        config=config, tokens=tokens, builder=python.Builder())

    # proto_code is generated with curly braces around blocks, as indentation is not
    # trivially context free.
    proto_code = perf_counter.run("Writer",
        python.Writer().run,
        ast)

    # the post processor converts the python code generated with curly braces into
    # the properly indentend, final form.
    code = perf_counter.run("PostProcessor",
        python.PostProcessor.run,
        proto_code)

    print_header("ABSTRACT_SYNTAX_TREE")
    print(ast)

    print_header("REGENERATED CODE")
    print(code)

    print_header("PERFORMANCE")
    perf_counter.finish_and_print_report()


def run_c(filename: str):
    config = alpaca.config.parser.run("./src/c/c_grammar.gm")
    with open(filename, 'r') as f:
        txt = f.read()
    tokens = alpaca.lexer.run(text=txt, config=config, callback=c.Callback)
    ast = alpaca.parser.run(config=config, tokens=tokens, builder=c.Builder())
    print(ast)
    recovered_txt = c.Writer().run(ast)
    print()
    print(recovered_txt)


def run_eisen(source_code_filename: str, verbose: bool = False):
    """
    Run an input source code file written in Eisen.

    :param source_code_filename: The file name.
    :type source_code_filename: str
    :param verbose: True to print verbose, defaults to False
    :type verbose: bool, optional
    """
    print(f"compiling '{source_code_filename}'")
    perf_counter = PerfCounter()

    # Parse the configuration file which defines the Eisen lexing/grammar rules.
    config = perf_counter.run("ConfigParsing",
        alpaca.config.parser.run,
        filename="./src/eisen/grammar.gm")

    with open(source_code_filename, 'r') as f:
        source_code = f.read()

    # Alpaca's lexer breaks the source code into tokens.
    tokens = perf_counter.run("Tokenizing",
        alpaca.lexer.run,
        text=source_code.strip(), config=config, callback=eisen.EisenCallback)

    if verbose:
        print_header("TOKENS")
        for t in tokens: print("\t", t)

    # Parser actually takes some time to init, so we add it
    parser = perf_counter.run("InitParser",
        eisen.SuperParser,
        config=config)

    ast = perf_counter.run("Parser",
        parser.parse,
        tokens=tokens)

    print_header("ABSTRACT SYNTAX TREE")
    print(ast)

    print_header("PERFORMANCE")
    state = eisen.BaseState.create_initial(config, ast, source_code, print_to_watcher=True)
    _, state = eisen.Workflow.execute_with_benchmarks(state)
    perf_counter.finish_and_print_report()

    if state.watcher.txt:
        print_header("COMPILER EXCEPTIONS")
        print(state.watcher.txt)
        return

    print_header("OUTPUT")
    ast = eisen.ToPython().run(state)

    proto_code = python.Writer().run(ast)
    code = eisen.ToPython.builtins + python.PostProcessor.run(proto_code) + eisen.ToPython.lmda + "\nmain___d_void_I__voidb()"
    with open("./build/test.py", 'w') as f:
        f.write(code)

    subprocess.run(["python", "./build/test.py"])
    print()

    # This code is used to transpile Eisen AST into C source code. It's not
    # working right now.
    # ==========================================================================
    # ast = eisen.Flattener().run(state)
    # state.ast = ast
    # # print(state.get_ast())
    # transmuted = eisen.CTransmutation(debug=False).run(ast, state)
    # print(transmuted)

    # # generate c code
    # c_config = alpaca.config.parser.run("./src/c/grammar.gm")
    # c_ast = alpaca.clr.CLRParser.run(c_config, transmuted)
    # c_ast = eisen.DotDerefFilter().apply(c_ast)
    # code = c.Writer().run(c_ast)
    # code = "#include <stdio.h> \n" + code
    # # print(code)
    # with open("./build/test.c", 'w') as f:
    #     f.write(code)

    # # run c code
    # subprocess.run(["gcc", "./build/test.c", "-o", "./build/test"])
    # x = subprocess.run(["./build/test"], capture_output=True)
    # got = x.stdout.decode("utf-8")
    # print(got)


def run(lang: str, filename: str, verbose: bool = False):
    match lang:
        case "python": run_python(filename)
        case "eisen": run_eisen(filename, verbose)
        case "c": run_c(filename)
        case "types": run_types(filename)


def run_types(filename: str):
    with open(filename, 'r') as f:
        txt = f.read()

    ast = alpaca.types.parser.run(txt)
    print(ast)


def run_single_test(name: str):
    status, msg = eisen.TestRunner.run_test_by_name(name)
    match status:
        case True: print(f"ran test '{name}' successfully")
        case False: print(msg)


def run_eisen_tests(name: str, verbose: bool):
    match name:
        case "": eisen.TestRunner.run_all_tests(verbose)
        case _: run_single_test(name)


def debug():
    run_eisen("test.txt")


def add_test(name: str):
    tomlheader = """
/// [Test]
/// name = "{0}"
/// info = \"\"\"\\
///     _description_
/// \"\"\"

/// [Expects]
/// success = _
/// output = ""

/// [[Expects.Exceptions]]
/// type = ""
/// contains = ""
"""
    testpath = "./src/eisen/tests/"
    full_path = testpath + name + ".en"
    path = pathlib.Path(full_path)
    path.parent.mkdir(parents=True, exist_ok=True)

    if path.exists():
        print("INFO: test already exists, not creating it again.")
        return

    with open(full_path, 'w') as f:
        f.write(tomlheader.format(name))
    subprocess.run(["code", "-r", full_path])


def print_header(title: str, with_spacing=True):
    title_width = len(title) + 2
    side_width = int((frame_width - title_width) / 2)
    extra_character = "" if title_width % 2 == 0 else "-"
    if with_spacing: print()
    print("-"*side_width + extra_character, title, "-"*side_width)
    if with_spacing: print()


if __name__ == "__main__":
    print(delim)
    print_header("EISEN", with_spacing=False)
    print(delim)

    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--debug", action="store_true")
    parser.add_argument("-t", "--test", action="store", type=str, nargs="?", const="")
    parser.add_argument("-v", "--verbose", action="store_true", default=False)
    parser.add_argument("-b", "--build", action="store_true")
    parser.add_argument("-i", "--input", action="store", type=str)
    parser.add_argument("-a", "--add-test", action="store_true")
    parser.add_argument("-l", "--lang",
        action="store",
        type=str,
        choices=["eisen", "python", "c", "types"],
        default="eisen")

    args = parser.parse_args()

    if args.add_test:
        add_test(args.test)
    elif args.test is not None:
        run_eisen_tests(args.test, args.verbose)
    elif args.input and args.lang:
        run(args.lang, args.input, args.verbose)
    elif args.build:
        eisen.TestRunner.rebuild_cache()
    elif args.debug:
        debug()

    print(delim)

print('Eisen!')
```
<Editor id="eisen" />
