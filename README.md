<!-- omit in toc -->
# Dot Env (.env) Generator

<!-- omit in toc -->
## Contents

- [📘 Description](#-description)
  - [Features](#features)
- [🚢 Installation](#-installation)
- [🔧 Usage](#-usage)
  - [Commands](#commands)
  - [Examples](#examples)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 📘 Description

Dot Env Generator CLI is a command-line tool designed to generate .env files using various providers, including Werf and 1Password.

### Features

- **Create .env with Werf:** Generate environment files based on configurations managed by Werf.
- **Create .env with 1Password:** Securely generate environment files using secrets stored in 1Password.

## 🚢 Installation

To install Dot Env Generator CLI from the source, follow these steps:

```bash
curl -s -L https://github.com/gbh-tech/dot-env-generator/releases/download/v0.3.0/dot-env-generator-darwin-x64.tar.gz | tar xz
chmod +x dot-env-generator
sudo mv dot-env-generator /usr/local/bin
```

## 🔧 Usage

Once installed, you can use the dot-env-generator command to generate .env files based on Werf or 1Password.

### Commands

werf: Generate a .env file using Werf configurations.
1pass: Generate a .env file using 1Password secrets.
help: Display help information about any command.

### Examples

To generate a .env file using Werf:

```bash
./dot-env-generator werf -e stage -o .env
```

To generate a .env file using 1Password:

```bash
./dot-env-generator op -v vault-id -i item-id -o .env
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make your changes.
4. Commit your changes (git commit -m 'Add new feature').
5. Push to the branch (git push origin feature-branch).
6. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.
